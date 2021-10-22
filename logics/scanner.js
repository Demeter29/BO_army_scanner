const Discord = require("Discord.js");
const embeds = require("../embeds/embeds.js");
const Canvas = require("canvas");
const db = require("../database/db.js");
const fs = require("fs");

const vision = require('@google-cloud/vision');
const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
});


module.exports = async (client, message) =>{

    const img = message.attachments.first();

    if(img.height<1080 || img.width<1920){
        message.reply({embeds: [embeds.errorEmbed.setDescription("Image must be at least 1920x1080 pixels")]})
    }

    const cropCanvas = Canvas.createCanvas(img.width*0.3, img.height);
    const ctx = cropCanvas.getContext('2d');
    ctx.drawImage(await Canvas.loadImage(img.url), img.width*0.7, 0, cropCanvas.width, cropCanvas.height, 0, 0, cropCanvas.width, cropCanvas.height);

    ctx.clearRect(cropCanvas.width*0.72, cropCanvas.height*0.167, cropCanvas.width*0.097, cropCanvas.height*0.786);

    const croppedImg = cropCanvas.toBuffer();

    message.reply({files: [croppedImg]})
    
    const [result] = await visionClient.documentTextDetection(croppedImg);
    const data = result.fullTextAnnotation.pages[0];

    //get username
    let username = getTextOfParagraph(data.blocks[0].paragraphs[0]);
    
    if(!validateUsername(username)){
        return message.reply("not valid username");
    }

    //get troop count
    let troopData = getTroopData(data);
    troopData = troopData.replace(/\s+/g, '');
    troopData = troopData.replace("(", "");
    troopData = troopData.replace(")", "");
    let troopDataParts=troopData.split("/");
    troopAmount= calculateTroopAmountWithWounded(troopDataParts[0]);
    let troopCap = troopDataParts[1];

    //get troop types and amount
    let troopTypes = await db.query(`SELECT id,name FROM troop`).then(rows =>{return rows;});
    let troopsMap = new Map();
    for(row of troopTypes){
        troopsMap.set(row.name, row.id);
    }

    let units = new Array;
    for(let i = 0; i < data.blocks.length; i++){
        for(paragraph of data.blocks[i].paragraphs){
            let troopName = getTextOfParagraph(paragraph);
            if(troopsMap.has(troopName)){
                let troopTypeAmount = calculateTroopAmountWithWounded(getTextOfParagraph(data.blocks[i+1].paragraphs[0]));
                console.log(troopName+": "+troopTypeAmount)
                units.push({troopName, troopTypeAmount});
                

            }
        }
    }
    
    await db.query(`REPLACE INTO user VALUES(?, ?, ?, 0);`, [message.author.id, username, troopCap]);
    await db.query(`DELETE FROM quantity WHERE user_id=${message.author.id}`);

    db.query(`SELECT id FROM participation WHERE user_id=${message.author.id} AND guild_id=${message.guild.id}`).then(rows =>{
        if(rows.length==0){
            db.query(`INSERT INTO participation (user_id, guild_id) VALUES(${message.author.id}, ${message.guild.id})`);
        }
    });

    for(unit of units){
        db.query(`INSERT INTO quantity (user_id, troop_id, amount) VALUES(${message.author.id}, ${troopsMap.get(unit.troopName)}, ${unit.troopTypeAmount})`)
    }

   let output=`\`\`\`\nusername: ${username} \ncurrent troops: ${troopAmount} \nmaximum party size: ${troopCap} \n\ntroops:\n`;

   for(unit of units){
       output+=unit.troopName+": "+unit.troopTypeAmount+"\n";
   }
   output+="```";

    const embed = new Discord.MessageEmbed()
    .setTitle("Debug output")
    .setDescription(output);

    message.channel.send({embeds: [embed]});
};

function getTextOfParagraph(paragraph){
    let text="";
    for(word of paragraph.words){
        for(symbol of word.symbols){
            text+=symbol.text;
            //console.log(symbol)
            if(symbol.property && symbol.property.detectedBreak && symbol.property.detectedBreak.type=="SPACE"){
                text+=" ";
            }
            else if(symbol.property && symbol.property.detectedBreak && symbol.property.detectedBreak.type=="LINE_BREAK"){
                //text+="\n";
            }
        }
    }
    return text;
}

function getTroopData(data){
    for(block of data.blocks){
        for(paragraph of block.paragraphs){
            let text = getTextOfParagraph(paragraph);
            let troopsIndex = text.toLocaleLowerCase().indexOf("troops");
            if(troopsIndex>-1){
                let troopCount = text.substring(troopsIndex+7);
                return troopCount
            }
            
        }
    }
    throw "no troop data found";
}

function calculateTroopAmountWithWounded(str){ //25 or 25+4w
    console.log(str)
    if(str.indexOf("+")>-1){
        console.log(parseInt(str.substring(0, str.indexOf("+"))) + parseInt(str.substring(str.indexOf("+")+1, str.indexOf("w"))))
        return parseInt(str.substring(0, str.indexOf("+"))) + parseInt(str.substring(str.indexOf("+")+1, str.toLocaleLowerCase().indexOf("w")));
        
    }
    else{
        return str;
    }
}

function validateUsername(username){
    if(username<3 || username.length>14){
        return false;
    }

    return true;
}

function validateTroopNumber(troopNumber){
    if(isNaN(troopNumber) || troopNumber<0 || troopNumber>95){
        return false;
    }

    return true;
}

