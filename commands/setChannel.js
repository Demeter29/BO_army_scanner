const Discord = require("discord.js");
const db = require("../database/db.js");
const errorEmbed = require("../embeds/error.js");
const successEmbed = require("../embeds/success.js")

exports.run = async (client, message, args) =>{
    if(message.mentions.channels.size==0){
        return message.reply({embeds: [errorEmbed.setDescription("You need to mention 1 channel!")]});
    }
    if(message.mentions.channels.size>1){
        return message.reply({embeds: [errorEmbed.setDescription("You can only mention 1 channel!")]});
    }
    const mentionedChannel = message.mentions.channels.first();
    if(!mentionedChannel.viewable){
        return message.reply({embeds: [errorEmbed.setDescription("I Don't have permission to that channel!")]});
    }
    if(!mentionedChannel.isText()){
        return message.reply({embeds: [errorEmbed.setDescription("You need to mention a text channel")]});
    }

    db.query(`UPDATE guild SET upload_channel='${mentionedChannel.id}' WHERE id='${message.guild.id}'`).then(()=>{
        message.reply({embeds: [successEmbed.setDescription("Upload channel has been updated!")]});
    })
    

}

exports.config = {
    name: "setchannel",
    adminCmd:true,
}