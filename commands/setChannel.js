const Discord = require("discord.js");
const db = require("../database/db.js");
const embeds = require("../embeds/embeds.js");

exports.run = async (client, message, args) =>{

    let previousChannel = await db.query(`SELECT upload_channel FROM guild WHERE id=${message.guild.id}`).then(rows =>{return rows});
    
    if(previousChannel.length==1){
        previousChannelId= previousChannel.upload_channel
        client.uploadChannels.splice(client.uploadChannels.indexOf(previousChannelId, 1));
    }

    db.query(`UPDATE guild SET upload_channel='${message.channel.id}' WHERE id='${message.guild.id}'`).then(()=>{
        message.reply({embeds: [embeds.successEmbed.setDescription(`${message.channel} is now the upload channel!`)]});
    })
    client.uploadChannels.push(message.channel.id)
    

}

exports.config = {
    name: "setchannel",
    adminCmd:true,
}