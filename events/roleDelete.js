const Discord = require("discord.js");
const db = require("../database/db.js");

module.exports = async (client, role) =>{
    db.query(`DELETE FROM size_role WHERE role_id=${role.id}`);
}