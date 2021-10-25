const Discord = require("discord.js");
const embeds = require("../embeds/embeds.js");
const Canvas = require("canvas");
const db = require("../database/db.js");
const fs = require("fs");
const { abbreviateNumber } = require("js-abbreviation-number");

const vision = require('@google-cloud/vision');
const asTable = require("as-table");
const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
});


module.exports = async (client, message) =>{

    const img = message.attachments.first();

    if(img.height<1070 || img.width<1910){
        return message.reply({embeds: [embeds.errorEmbed.setDescription("Image must be at least 1920x1080 pixels")]})
    }
    
    message.channel.sendTyping();

    const cropCanvas = Canvas.createCanvas(img.width*0.3, img.height);
    const ctx = cropCanvas.getContext('2d');
    ctx.drawImage(await Canvas.loadImage(img.url), img.width*0.7, img.height*0.01, cropCanvas.width, cropCanvas.height, 0, 0, cropCanvas.width, cropCanvas.height);

    const colors= ["black", "white", "grey",]
    for(let x=0;x<3;x++){

        console.log("attempt "+x)
        ctx.fillStyle = colors[x];
        ctx.fillRect(cropCanvas.width*0.62, cropCanvas.height*0.16, cropCanvas.width*0.189, cropCanvas.height);  
        ctx.fillRect(cropCanvas.width*0.29, cropCanvas.height*0.899, cropCanvas.width, cropCanvas.height);
        ctx.fillRect(cropCanvas.width*0.92, cropCanvas.height*0, cropCanvas.width, cropCanvas.height);

        const croppedImg = cropCanvas.toBuffer();

        message.reply({files: [croppedImg]})
        
        
        try{
            const [result] = await visionClient.documentTextDetection(croppedImg);
            const data = result.fullTextAnnotation.pages[0];
            console.log(data.blocks.length)
            //get username
            let username = getTextOfParagraph(data.blocks[0].paragraphs[0]);
            
            if(!validateUsername(username)){
                throw {msg: "couldn't find username", data: [username]};
            }

            //get troop count
            let troopBlockIndex = findBlockWithString(data, "troops");
            if(troopBlockIndex==-1){
                throw {msg:"couldn't find max party size", data: [username]};
            }
            troopData = getTextOfParagraph(data.blocks[troopBlockIndex].paragraphs[0]);
            troopData = troopData.split("(")[1]
            troopData = troopData.replace(/\s+/g, '');
            troopData = troopData.replace("(", "");
            troopData = troopData.replace(")", "");
            let troopDataParts=troopData.split("/");
            currentTroopCount= calculateTroopAmountWithWounded(troopDataParts[0]);
            let maxPartySize = troopDataParts[1];

            if(!validateTroopCount(currentTroopCount)){
                throw {msg: "currentTroopCount is not valid", data: [username, currentTroopCount, maxPartySize]};
            }
            if(!validateTroopCount(maxPartySize)){
                throw {msg: "maxPartySize is not valid", data: [username, currentTroopCount, maxPartySize]};
            }

            


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
                        let troopTypeAmount = parseInt(calculateTroopAmountWithWounded(getTextOfParagraph(data.blocks[i+1].paragraphs[0])));
                        units.push({troopName, troopTypeAmount});        
                    }
                }
            }
            let sum=1;
            for(unit of units){
                if(!validateTroopCount(unit.troopTypeAmount)){
                    throw {msg: "troop amount is not valid", data: [username, currentTroopCount, maxPartySize, units]};
                }
                sum+=unit.troopTypeAmount;
            }
            if(sum!=currentTroopCount){
                throw {msg: "couldn't scan all the troops", data: [username, currentTroopCount, maxPartySize, units]};
            }

            //get gold amount
            //let goldBlockIndex = findBlockWithString(data, "Prisoners")+1;
            //let rawGold = getTextOfParagraph(data.blocks[goldBlockIndex].paragraphs[0]);
            let rawGold = getTextOfParagraph(data.blocks[data.blocks.length-1].paragraphs[0]);
            let gold = convertGold(rawGold);

            if(!validateGold(gold)){
                gold=0;
            }

            //size role
            const roleMessage = await require("./sizeRole.js")(client, message, maxPartySize).catch(error =>{
                if (error.code == Discord.Constants.APIErrors.MISSING_PERMISSIONS) {
                    //message.channel.send({embeds: [embeds.errorEmbed.setDescription("I don't have permission to give you roles\n Every role listed `+role list` needs to be under ")]})
                }
            });;

            

            //db
            await db.query(`REPLACE INTO user VALUES(?, ?, ?, ?);`, [message.author.id, username, maxPartySize, gold]);
            await db.query(`DELETE FROM quantity WHERE user_id=${message.author.id}`);

            await db.query(`SELECT id FROM participation WHERE user_id=${message.author.id} AND guild_id=${message.guild.id}`).then(async (rows) =>{
                if(rows.length==0){
                    await db.query(`INSERT INTO participation (user_id, guild_id) VALUES(${message.author.id}, ${message.guild.id})`);
                }
            });

            for(unit of units){
                await db.query(`INSERT INTO quantity (user_id, troop_id, amount) VALUES(${message.author.id}, ${troopsMap.get(unit.troopName)}, ${unit.troopTypeAmount})`)
            }

            //rank
            let rankOutput = await require("./rank.js")(message.member, username);


            userOutput=asTable([["username: ", username],
                                ["Maximum party size: ", maxPartySize, "(#2)"],
                                ["Gold Balance:", abbreviateNumber(gold, 2), "(#5)"]]);

            let troops= [];
            for(unit of units){
                troops.push({name: unit.troopName, amount: unit.troopTypeAmount});
            }
            let troopsOutput=asTable(troops);

            const embed = new Discord.MessageEmbed()
            .setTitle("Results")
            .setDescription("Player Info:```"+rankOutput    +"```\n\n Troops:```"+troopsOutput+"```");

            message.channel.send({embeds: [embed]});

            break;
        }
        catch(error){
            if(x<2){
                continue;
            }
            console.log(error)
            message.reply({embeds: [embeds.errorEmbed.setDescription(
                `I failed to scan your screenshot :( \n
                error message: \`${error.msg}\`\n
                try doing these:
                -Make sure to include the whole party screen and not just a part of it.\n-Ensure that your troop list on the right is scrolled all the way to to top.\n-Make sure all of your troops fit into the screenshot.\n-Try not have anything on the right side of your screen that is not part of bannerlord.\n-"Options > Gameplay > UI Scale" needs to be 1 or at least close to it.\n-sometimes wounded soldiers can mess up the scan, wait until they are healed.`
            )]})

            
            let output="```";
            if(error.data[0]){
                output+="username: "+error.data[0]+"\n";
            }
            if(error.data[1]){
                output+="currentTroops: "+error.data[1]+"\n";
            }
            if(error.data[2]){
                output+="maxPartySize: "+error.data[2]+"\n";
            }

            if(error.data[3]){
                output+="\n";
                for(unit of error.data[3]){
                    output+=unit.troopName+": "+unit.troopTypeAmount+"\n";
                }
            }
        
            output+="```";

            client.channels.resolve(client.config.errorChannelId).send({content: `-----------------------------------------------\nserver name: ${message.guild.name}\nuser name: ${message.member.displayName}\nerror msg: \`${error.msg}\` ${output}`, files: [img, croppedImg]})
        }
    }
};

function getTextOfParagraph(paragraph){
    let text="";
    for(word of paragraph.words){
        for(symbol of word.symbols){
            text+=symbol.text;
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

function findBlockWithString(data, str){
    for(let i=0;i<data.blocks.length;i++){
        for(paragraph of data.blocks[i].paragraphs){
            let text = getTextOfParagraph(paragraph);
            let troopsIndex = text.toLowerCase().indexOf(str.toLowerCase());
            if(troopsIndex>-1){

                return i;
            }    
        }
    }
    return -1;
}

function calculateTroopAmountWithWounded(str){ //25 or 25+4w
    if(str.split(" ").length>1){
        str=str.split(" ")[0];
    }

    if(str.indexOf("+")>-1){
        return parseInt(str.substring(0, str.indexOf("+"))) + parseInt(str.substring(str.indexOf("+")+1, str.toLocaleLowerCase().indexOf("w")));
    }
    else{
        return str;
    }
}

function convertGold(gold){
    let amount=0;
    gold = gold.toLowerCase();

    if(gold.includes('o')){
        gold = gold.replace('o', '');
        gold = gold.replace(' ', '');
    }
    
    if(gold.includes('k')){
        gold = gold.split('k')[0];
        amount=parseFloat(gold)*1000;
    }
    else if(gold.includes('m')){
        gold = gold.split('k')[0];
        amount=parseFloat(gold)*1000000;
    }
    else{
        amount = gold;
    }

    return amount;
}

function validateUsername(username){
    if(username<3 || username.length>20){  //actually it's between 3 and 14 but I added a little way
        return false;
    }

    return true;
}

function validateTroopCount(troopCount){
    if(isNaN(troopCount) || troopCount<=0 || troopCount>95){
        return false;
    }

    return true;
}

function validateGold(gold){
    if(isNaN(gold) || gold<=0 || gold>10000000000){
        return false;
    }
    return true;
}
