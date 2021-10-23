const Discord = require("discord.js");
const db = require("../database/db.js")

module.exports = async (client, channel) =>{
    if(client.uploadChannels.includes(message.channel.id)){
        client.uploadChannels.splice(client.uploadChannels.indexOf(channel), 1);

        db.query(`UPDATE guild SET upload_channel=null WHERE upload_channel=${channel.id}`)
    }
}