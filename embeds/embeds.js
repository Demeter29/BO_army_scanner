const Discord = require("discord.js");

module.exports = {
    errorEmbed: new Discord.MessageEmbed()
    .setTitle("Error")
    .setColor("#bb2124")
    .setFooter("If you need help join our support server"),
    
    successEmbed: new Discord.MessageEmbed()
    .setTitle("Success")
    .setColor("#22bb33")
}
