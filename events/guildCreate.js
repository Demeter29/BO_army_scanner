const Discord = require("discord.js");
const db = require("../database/db.js");

module.exports = async (client, guild) =>{
    db.query(`INSERT INTO guild VALUES('${guild.id}', '${client.config.defaultPrefix}', null)`);
}