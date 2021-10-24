const Discord = require("discord.js");
const db = require("../database/db.js")

module.exports = async (client, member) =>{
    db.query(`DELETE FROM participation WHERE user_id = ${member.id}`);
}