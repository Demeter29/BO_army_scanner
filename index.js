const Discord = require('discord.js');
const client = new Discord.Client({
    intents:[Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES]
});
client.config=require("./config.json");
const fs=require("fs");

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
commandFiles.forEach(file =>{
    const command = require(`./commands/${file}`);
    client.commands.set(command.config.name, command);
});

const eventFiles = fs.readdirSync("./events/").filter(file => file.endsWith('.js'));
eventFiles.forEach(file =>{
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
});

process.on("rejectionHandled"   , ( err ) => console.error( err ) );
process.on("unhandledRejection" , ( err ) => console.error( err ) );
process.on("uncaughtException"  , ( err ) => console.error( err ) );

client.login(client.config.token);