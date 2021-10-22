const {Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton} = require("discord.js");
const db = require("../database/db.js");
let asTable = require ('as-table').configure({minColumnWidths: [8, 17, 17, 16]});


exports.run = async  (client, message, args) =>{
    let pages = new Array();
    let rows;
    let currentPage=0;
    let optionIndex;

    const leaderboardEmbed = new MessageEmbed()
    .setTitle(message.guild.name+" Leaderboard")
    .setDescription("Use the dropdown menu to select a leaderboard!")
    .setThumbnail(message.guild.iconURL())
    const selectRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('sort-by')
                .setPlaceholder("Sort by...")
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
                .setStyle("SECONDARY")
                .setEmoji("<arrow_left:901187985272373288>")
                .setCustomId("page-left"),
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("<arrow_right:901187999981781002>")
                .setCustomId("page-right")
        )

    message.channel.send({embeds: [leaderboardEmbed], components: [selectRow]});

    const filter = (interaction) =>(
        (interaction.isSelectMenu() || interaction.isButton()) &&
        interaction.user.id == message.author.id &&
        (interaction.customId == "sort-by" || interaction.customId == "page-left" || interaction.customId == "page-right")   
    ) 
    
    const collector = message.channel.createMessageComponentCollector({filter });

    collector.on('collect', async(collected) =>{
        collected.deferUpdate();

        if(collected.isSelectMenu()){
            pages = [];
            switch (collected.values[0]){
                case 'max-party-size':
                    rows = await getMaxPartySizeData(message.guild);
                    optionIndex=0;
                    break;
                case 't6-troops':
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
                pages.push(rows.splice(0, 2))
            }
            currentPage=0;

            pageRow.components[0].setDisabled(true);
            if(pages.length==1){
                pageRow.components[1].setDisabled(true);
            }
            else{
                pageRow.components[1].setDisabled(false);
            }
        }                                        
        else if(collected.isButton()){
            pageRow.components[0].setDisabled(false);
            pageRow.components[1].setDisabled(false);

            if(collected.customId=="page-left"){
                currentPage--;
                if(currentPage==0){
                    pageRow.components[0].setDisabled(true);
                }               
            }
            
            else if(collected.customId=="page-right"){
                currentPage++;
                if(currentPage>=pages.length-1){
                    pageRow.components[1].setDisabled(true);
                }
                
            }
        }

            leaderboardEmbed.setDescription("```"+asTable(pages[currentPage])+"```");
    
            selectRow.components[0].options[optionIndex].default=true
            collected.message.edit({embeds: [leaderboardEmbed.setThumbnail().setTitle("").setAuthor(message.guild.name, message.guild.iconURL())], components: [selectRow, pageRow]})
            selectRow.components[0].options[optionIndex].default=false

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

