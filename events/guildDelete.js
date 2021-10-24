const Discord = require("discord.js");
const db = require("../database/db.js");

module.exports = async(client, guild) =>{
    db.query(`DELETE FROM guild WHERE id=${guild.id}`);
    db.query(`DELETE FROM participation WHERE guild_id=${guild.id}`);

}