const Discord = require("discord.js");

exports.run = async (client, message, args) =>{
    message.channel.send("ok")
    console.log(message.member.id)
    console.log(message.member.user.id)
}

exports.config = {
    name:"help",
    adminCmd: false
}