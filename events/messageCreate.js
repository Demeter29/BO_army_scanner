const Discord = require("discord.js");
//const client=require("../constants/client.js");
const db=require("../database/db.js");

module.exports = async (client, message) =>{
    if (message.author.bot) return;
    if(!message.guild) return;

    if(client.uploadChannels.includes(message.channel.id) && message.attachments.size>0){
        return require("../logics/scanner.js")(client, message);
    }

    const prefix=client.guildPrefixes.get(message.guild.id);

    const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(prefixMention)) return message.reply(`My prefix on this guild is \`${prefix}\` and to get my list of commands use \`${prefix}help\``);

    if(!message.content.toLowerCase().startsWith(prefix)) return;

    const args=message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    
    // If the member on a guild is invisible or not cached, fetch them. TODO: not sure if really needed
    if (message.guild && !message.member) await message.guild.members.fetch(message.author); 
    
    const cmd = client.commands.get(command);
    if (!cmd) return;
    
    if(cmd.config.adminCmd && !(message.member.permissions.has("ADMINISTRATOR"))) return message.channel.send("you don't have permissions for this command");

    cmd.run(client, message, args);
}