const Discord = require("discord.js");
const db = require("../database/db.js");

module.exports = async (client, guild) =>{
    db.query(`REPLACE INTO guild VALUES('${guild.id}', '${client.config.defaultPrefix}', null)`);

    client.guildPrefixes.set(guild.id, client.config.defaultPrefix);
}