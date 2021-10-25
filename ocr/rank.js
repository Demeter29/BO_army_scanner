const Discord = require("discord.js");
const db = require("../database/db.js");
const asTable = require("as-table");
const { abbreviateNumber } = require("js-abbreviation-number");

module.exports = async (member, username) => {
    let output="```";
    let maxPartySizeRows = await getMaxPartySizeData(member);
    let goldRows = await getGoldData(member);
    let wageRows = await getWageData(member);

    let stats = [];
    stats.push(["Username:", username])
    for(row of maxPartySizeRows){
        if(row.id==member.id){
            stats.push(["Maximum Party size:", row.size, `(${row.rank})`])
        }
    }
    for(row of goldRows){
        if(row.id==member.id){
            stats.push(["Gold:", row.gold, `(${row.rank})`])
        }
    }
    for(row of wageRows){
        if(row.id==member.id){
            stats.push(["Wages:", row.wages, `(${row.rank})`])
        }
    }

    return asTable(stats);
}

async function getMaxPartySizeData(member){
    return await db.query(`SELECT user.id, max_party_size AS size FROM user INNER JOIN participation ON user.id=participation.user_id WHERE guild_id=${member.guild.id} ORDER BY max_party_size DESC`).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })   
}

async function getGoldData(member){
    return await db.query(`
    SELECT user.id, gold FROM user
    INNER JOIN participation ON user.id=participation.user_id
    WHERE guild_id=${member.guild.id}
    AND gold>0
    ORDER BY gold DESC;
    `).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
            rows[i].gold= abbreviateNumber(rows[i].gold, 2);
        }
        return rows;
    })
}

async function getWageData(member){
    return db.query(`
    SELECT user.id, SUM(quantity.amount*troop.wage)AS 'wages' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${member.guild.id}
    GROUP BY username  
    ORDER BY \`wages\` DESC;
    `).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })
}