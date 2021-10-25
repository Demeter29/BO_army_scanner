const Discord = require("discord.js");
const db = require("../database/db.js");
const { abbreviateNumber } = require("js-abbreviation-number");
const asTable = require("as-table").configure({minColumnWidths: [6, 6, 6,]});

exports.run = async (client, message, args) =>{
    const guildEmbed = new Discord.MessageEmbed()
    .setTitle(message.guild.name)
    .setThumbnail(message.guild.iconURL())

    let members =  await getMemberCount(message.guild);
    let totalMaxPartySize = await getTotalMaxPartySize(message.guild);
    let totalGold = await getTotalGold(message.guild);
    let totalWages = await getTotalWages(message.guild);
    let totalTroops = await getTotalNumberOfTroops(message.guild);
    const stats = [
        {stat: "members", total: members, average: ""},
        {stat: "combined gold", total: abbreviateNumber(totalGold), average: abbreviateNumber(Math.round(totalGold/members))},
        {stat: "combined wages", total: abbreviateNumber(totalWages), average: abbreviateNumber(Math.round(totalWages/members))},
        {stat: "combined number of troops", total: totalTroops, average: Math.round(totalTroops/members)},
        {stat: "combined max party size", total: totalMaxPartySize, average: Math.round(totalMaxPartySize/members)},
    ]

    const troops = [
        {tier: "1", total: await getNumberOfTierTroops(1, message.guild), "%": Math.round(await getNumberOfTierTroops(1, message.guild)/totalTroops*100)+"%"},
        {tier: "2", total: await getNumberOfTierTroops(2, message.guild), "%": Math.round(await getNumberOfTierTroops(2, message.guild)/totalTroops*100)+"%"},
        {tier: "3", total: await getNumberOfTierTroops(3, message.guild), "%": Math.round(await getNumberOfTierTroops(3, message.guild)/totalTroops*100)+"%"},
        {tier: "4", total: await getNumberOfTierTroops(4, message.guild), "%": Math.round(await getNumberOfTierTroops(4, message.guild)/totalTroops*100)+"%"},
        {tier: "5", total: await getNumberOfTierTroops(5, message.guild), "%": Math.round(await getNumberOfTierTroops(5, message.guild)/totalTroops*100)+"%"}, 
        {tier: "6", total: await getNumberOfTierTroops(6, message.guild), "%": Math.round(await getNumberOfTierTroops(6, message.guild)/totalTroops*100)+"%"},     


    ]
 
    guildEmbed.setDescription("```"+asTable(stats)+"```\n\n troops:```"+asTable(troops)+"```");

    message.channel.send({embeds: [guildEmbed]});
}

async function getMemberCount(guild){
    return await db.query(`SELECT count(user.id) AS total FROM user 
                        INNER JOIN participation ON user.id=participation.user_id
                        WHERE participation.guild_id=${guild.id}`)
                        .then(rows =>{
                            if(rows.length==0){
                                return 0;
                            }
                            else{
                                return rows[0].total
                            }
                            
                        })
}

async function getTotalMaxPartySize(guild){
    return await db.query(`SELECT sum(max_party_size)AS total FROM user 
                        INNER JOIN participation ON user.id=participation.user_id 
                        GROUP BY guild_id HAVING guild_id=${guild.id};`).then(rows =>{
                            if(rows.length==0){
                                return 0;
                            }
                            else{
                                return rows[0].total
                            }
                            
                        })
}

async function getTotalGold(guild){
    return await db.query(`SELECT sum(GOLD)AS total FROM user INNER JOIN participation ON user.id=participation.user_id GROUP BY guild_id HAVING guild_id=${guild.id};`).then(rows =>{
        if(rows.length==0){
            return 0;
        }
        else{
            return rows[0].total
        }
        
    })

}

async function getTotalWages(guild){
    return await db.query(`SELECT SUM(quantity.amount*troop.wage) AS total FROM user 
                INNER JOIN participation ON user.id=participation.user_id 
                INNER JOIN quantity ON user.id = quantity.user_id
                INNER JOIN troop ON troop.id = quantity.troop_id
                GROUP BY participation.guild_id
                HAVING participation.guild_id=${guild.id};`)
                .then(rows =>{
                    if(rows.length==0){
                        return 0;
                    }
                    else{
                        return rows[0].total
                    }
                    
                })
}

async function getTotalNumberOfTroops(guild){
    return db.query(`SELECT SUM(quantity.amount) AS total FROM user
                    INNER JOIN participation ON user.id=participation.user_id 
                    INNER JOIN quantity ON user.id = quantity.user_id
                    INNER JOIN troop ON troop.id = quantity.troop_id
                    GROUP BY participation.guild_id
                    HAVING participation.guild_id=${guild.id}`)
                    .then(rows =>{
                        if(rows.length==0){
                            return 0;
                        }
                        else{
                            return rows[0].total
                        }
                        
                    })
}

async function getNumberOfTierTroops(tier, guild){
    return db.query(`SELECT SUM(quantity.amount) AS total FROM user
                    INNER JOIN participation ON user.id=participation.user_id 
                    INNER JOIN quantity ON user.id = quantity.user_id
                    INNER JOIN troop ON troop.id = quantity.troop_id
                    WHERE troop.tier=${tier}
                    GROUP BY participation.guild_id
                    HAVING participation.guild_id=${guild.id}`)
                    .then(rows =>{
                        if(rows.length==0){
                            return 0;
                        }
                        else{
                            return rows[0].total
                        }
                        
                    })
}

exports.config = {
    name: "guild",
    adminCmn: false
}