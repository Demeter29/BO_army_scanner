const Discord = require("discord.js");
const embeds = require("../embeds/embeds.js");
const Canvas = require("canvas");
const db = require("../database/db.js");
const fs = require("fs");

const vision = require('@google-cloud/vision');
const visionClient = new vision.ImageAnnotatorClient({
    keyFilename: 'APIKey.json'
});


module.exports = async (client, message, maxPartySize) =>{
    const roles = await db.query(`SELECT role_id, size FROM size_role WHERE guild_id=${message.guild.id} ORDER BY size DESC`);
    let memberRoles = message.member.roles.cache;

    let roleIds=[];
    for(role of roles){
        roleIds.push(role.role_id);
    }

    let roleMessage= "";
    for(let i=0;i<roles.length;i++){
        if(maxPartySize>=roles[i].size){
            console.log("got here")
            if(memberRoles.has(roles[i].role_id)){
                roleIds.splice(roleIds.indexOf(roles[i].role_id), 1);
                await message.member.roles.remove(roleIds);

                let output = `your current rank: <@&${roles[i].role_id}>\n`;
                if(i>0){
                    output+=`next rank: <@&${roles[i-1].role_id}>`
                }          
                return output;  
            }
            else{
                for(role of roles){
                    await message.member.roles.remove(roleIds)

                    return message.member.roles.add(roles[i].role_id);
                }
            }
        }
    }
    
}
