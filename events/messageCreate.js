const Discord = require("discord.js");
//const client=require("../constants/client.js");
const db=require("../database/db.js");

module.exports = async (client, message) =>{

    if (message.author.bot) return;
    if(!message.guild) return;

    if(client.uploadChannels.includes(message.channel.id) && message.attachments.size>0){
        let debug=false;
        if(message.content.split(" ")[0]=="debug" && message.author.id==client.config.devId){
            debug = true;
        }

        return require("../ocr/scanner.js")(client, message, debug);
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

    let debug = false;
    if(cmd=="debug" && message.author.id==client.config.devId){
        cmd==args.shift();
        debug = true;
    }
    
    if(cmd.config.adminCmd && !(message.member.permissions.has("ADMINISTRATOR") || message.member.id!=client.config.devId)) return message.channel.send("you don't have permissions for this command");

    cmd.run(client, message, args, debug);
}