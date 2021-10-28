const Discord = require("discord.js");
const db = require("../database/db.js");

exports.run = async (client, message, args) =>{
    const helpEmbed = new Discord.MessageEmbed()
    .setTitle("Help")
    .setFooter("If you need further help join our support server where we are happy to help you!");

    await db.query(`SELECT upload_channel FROM guild WHERE id=${message.guild.id} AND upload_channel IS NOT NULL`)
        .then(rows =>{
            if(rows.length>0){
                helpEmbed.setDescription(`send a screenshot of your party screen (fullscreened) in the <#${rows[0].upload_channel}> channel.\nThe screenshot must be at least 1920x1080p and it needs to be fullscreen!\n‎`);
            }
            else{
                helpEmbed.setDescription(`An upload channel has not been set up on this server! Please tell an admin to use the \`+setchannel\` command so the bot can start accepting screenshots to process.\n‎`);
            }
        });
        
    helpEmbed.addField("General Commands:", "```+leaderboard```shows you the leaderboard of this guild \n\n```+guild```‎shows you statistics about the guild\n‎");
    helpEmbed.addField("Admin Commands:", "```+setchannel```sets the current channel as the upload channel where users can upload their party screen. The bot will only take screenshots from this channel!\n\n```+role```Set up roles the players will get as they level up their maximum party size\n‎");

    message.channel.send({embeds: [helpEmbed], components: [helpRow]});
}

exports.config = {
    name:"help",
    adminCmd: false
}

const helpRow = new Discord.MessageActionRow().addComponents(
    new Discord.MessageButton()
        .setStyle("LINK")
        .setLabel("Support Server")
        .setURL("https://discord.gg/zQcCybVkqx"),
    new Discord.MessageButton()
    .setStyle("LINK")
    .setLabel("Invite bot to your server")
    .setURL("https://discord.com/api/oauth2/authorize?client_id=900836857322041395&permissions=268435456&scope=bot")
    )

