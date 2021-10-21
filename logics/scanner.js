const Discord = require("Discord.js");
const embeds = require("../embeds/embeds.js");
const Canvas = require("canvas");

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
    
    const croppedImg = cropCanvas.toBuffer();

    message.reply({files: [croppedImg]})
    
    const [result] = await visionClient.textDetection(croppedImg);
    const data = result.fullTextAnnotation.pages[0];
    
    //get username
    let username = getTextOfParagraph(data.blocks[0].paragraphs[0]);
    
    if(!validateUsername(username)){
        return message.reply("not valid username");
    }
    message.channel.send("username: "+username);

    //get troop count
    let troopData = getTroopData(data);
    troopData = troopData.replace(/\s+/g, '');
    troopData = troopData.replace("(", "");
    troopData = troopData.replace(")", "");
    let troopDataParts=troopData.split("/");
    let troopAmount=0;
    console.log(troopData)
    if(troopDataParts[0].indexOf("+")>-1){
        troopAmount=parseInt(troopDataParts[0].substring(0, troopDataParts[0].indexOf("+"))) + parseInt(troopDataParts[0].substring(troopDataParts[0].indexOf("+")+1, troopDataParts[0].indexOf("w")));
    }
    else{
        troopAmount=troopDataParts[0];
    }
    let troopCap = troopDataParts[1];

    //get troop types and amount


    message.channel.send("troop count: "+troopAmount)
    message.channel.send("troop Cap: "+troopCap)
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
                text+="\n";
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

