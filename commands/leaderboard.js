const {Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const db = require("../database/db.js");
let asTable = require ('as-table').configure({minColumnWidths: [13, 13, 13, 13]});


exports.run = async  (client, message, args) =>{
    let pages = new Array();
    let rows;
    let currentPage=0;
    let optionIndex;

    const leaderboardEmbed = new MessageEmbed()
    .setTitle("Leaderboard")



    const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('sort-by')
                .addOptions({
                    label: "Maximum party size",
                    value: "max-party-size",
                    description: "sort by the maximum number of troops your party can hold"
                },
                {
                    label: "Number of T6 troops",
                    value: "t6-troops",
                    description: "sort by the number of tier 6 troops"
                },
                {
                    label: "Number of T5+ troops",
                    value: "t5-troops",
                    description: "sort by the number of tier 5 or higher troops"
                },
                {
                    label: "Gold",
                    value: "gold",
                    description: "sort by the amount of gold"
                },
                {
                    label: "Wages",
                    value: "wages",
                    description: "sort by the hourly wages cost"
                },
                ),
        )

        const pageRow = new MessageActionRow()
        .addComponents(            
            new MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("◀️")
                .setCustomId("page-left"),
            new MessageButton()
                .setStyle("PRIMARY")
                .setEmoji("▶️")
                .setCustomId("page-right")
        )

    let leaderboardMessage = await message.channel.send({embeds: [leaderboardEmbed], components: [row, pageRow]});

    const filter = (interaction) =>(
        (interaction.isSelectMenu() || interaction.isButton()) &&
        interaction.user.id == message.author.id &&
        (interaction.customId == "sort-by" || interaction.customId == "page-left" || interaction.customId == "page-right")
        
    ) 
    
    const collector = message.channel.createMessageComponentCollector({filter });

    collector.on('collect', async(collected) =>{
        collected.deferUpdate();

        console.log(currentPage)

        if(collected.isSelectMenu()){
            pages = [];
            switch (collected.values[0]){
                case 'max-party-size':
                    rows = await getMaxPartySizeData(message.guild);
                    optionIndex=0;
                    break;
                case 't6-troops':
                    console.log("got here")
                    rows = await getT6TroopsData(guild);
                    optionIndex=1;
                    break;
                case 't5-troops':
                    rows = await getT5PlusTroopsData(guild);
                    optionIndex=2;
                    break;
            }
            for(let i=0;i<rows.length;i++){
                rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
            }
    
            while(rows.length>0){
                pages.push(rows.splice(0, 20))
            }

            currentPage=0;
        }                                        
        else if(collected.isButton()){
            if(collected.customId=="page-left" && currentPage>0){
                console.log("minus")
                currentPage--;
            }
            
            else if(collected.customId=="page-right" && currentPage<pages.length-1){
                console.log("plus")
                currentPage++;
            }

        }

            leaderboardEmbed.setDescription("```"+asTable(pages[currentPage])+"```");
    
            row.components[0].options[optionIndex].default=true
            collected.message.edit({embeds: [leaderboardEmbed], components: [row, pageRow]})
            row.components[0].options[optionIndex].default=false

    })       
                
}   

exports.config = {
    name: "leaderboard",
    adminCmd: false
}

async function getMaxPartySizeData(guild){
    let rows = await db.query(`SELECT username, max_party_size AS size FROM user INNER JOIN participation ON user.id=participation.user_id WHERE guild_id=${guild.id} ORDER BY max_party_size DESC`).then(rows =>{return rows;})

    return rows;
}

async function getT6TroopsData(guild){
    let rows = await db.query(`
    SELECT username, SUM(quantity.amount) AS 'T6 troops' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${guild.id}
    AND troop.tier=6
    GROUP BY username
    ORDER BY 'T6 troops' DESC;
    `).then(rows =>{return rows;})

    return rows;
}

async function getT5PlusTroopsData(guild){
    let rows = await db.query(`
    SELECT username, SUM(quantity.amount) AS 'T5/T6 troops' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${guild.id}
    AND (troop.tier=5 OR troop.tier=6)
    GROUP BY username
    ORDER BY 'T5/T6 troops' DESC;
    `).then(rows =>{return rows;})

    return rows;
}

