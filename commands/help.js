const Discord = require("discord.js");

exports.run = async (client, message, args) =>{
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle("BO Army Organizer")
    .setDescription("");

    message.channel.send({embeds: [helpEmbed]});
}

exports.config = {
    name:"help",
    adminCmd: false
}