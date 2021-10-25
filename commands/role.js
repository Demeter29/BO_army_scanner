const Discord = require("discord.js");
const db = require("../database/db.js");
const embeds = require("../embeds/embeds.js");

exports.run = async (client, message, args) =>{
        if(args.length==0 || args[0] == "help"){
            const helpEmbed = new Discord.MessageEmbed()
            .setTitle("setting up roles")
            .setDescription("With this command you can set up roles players will get as they level up their maximum party size. (They will only get the highest role)")
            .addField("Commands:", "```+role list```List all the roles that is currently being awarded to players\n\n```+role add {role name} {required party size}```Add a new role to be awarded to players, don't include the brackets!\n\n```+role remove {role name}```Remove a role from the list so it won't be awarded to players anymore")
            .setFooter("if you need further help join our support server")
            return message.channel.send({embeds: [helpEmbed]})
        }
        else if(args[0]=="list"){
            const roles = await db.query(`SELECT role_id, size FROM size_role WHERE guild_id='${message.guild.id}' ORDER BY size DESC`);
            let output="";
            for(role of roles){
                output+=`${message.guild.roles.resolve(role.role_id)}: ${role.size}\n`;
            }

            const listEmbed = new Discord.MessageEmbed()
            .setTitle("Role list")
            .setDescription("These roles will be assigned to players if their maximum party size is equal or higher to these roles. (Only the highest role will be assigned). \n\n"+output)

            return message.channel.send({embeds: [listEmbed]});
        }
        else if(args[0]=="add"){
            try{
                if(args.length!=3){
                    throw "not enough or too much arguments"
                }
                if(args[1].length>32){
                    throw "role name cannot be longer than 32 characters"
                }
                if(isNaN(args[2])){
                    throw "The size must be a number!"
                }
        
                let role = await message.guild.roles.cache.find(r => (r.name.toLowerCase()==(args[1].toLowerCase()))) || message.guild.roles.cache.get(args[1]) || message.mentions.roles.first()
                            
                if(!role){
                   role = await message.guild.roles.create({
                       name: args[1]
                   })
                }  

                await db.query(`SELECT size FROM size_role WHERE size=${args[2]} AND guild_id=${message.guild.id}`).then(rows =>{
                    if(rows.length>0){
                        throw "A role with that required size already exists, if you want to replace them then first you need to remove the other one"
                    }
                })
 
                message.reply({embeds: [embeds.successEmbed.setDescription(`${role} will now be assigned to players who's maximum party size is at least ${args[2]}`)]});
 
                db.query(`INSERT INTO size_role VALUES('${role.id}', ${args[2]}, '${message.guild.id}')`);
            }
            catch(error){
                return message.reply({embeds: [embeds.errorEmbed.setDescription(error+"\n\n usage: ```+role add {role name} {size}```without the brackets")]})
            }    
        }
        else if(args[0]=="remove"){
            let role = await message.guild.roles.cache.find(r => (r.name.includes(args[1]))) || message.guild.roles.cache.get(args[1]) || message.mentions.roles.first()

            if(!role){
                return message.reply({embeds: [embeds.errorEmbed.setDescription("I couldn't find A role with that name \n\n usage: ```+role remove {role name}```without the brackets")]})
            }

            await db.query(`DELETE FROM size_role WHERE role_id=${role.id} AND guild_id=${message.guild.id}`);

            return message.channel.send({embeds: [embeds.successEmbed.setDescription(`from now on players won't be assigned the ${role} role`)]})
        }    
}

exports.config = {
    name: "role",
    adminCmd:true,
}

const helpEmbed = new Discord.MessageEmbed()
.setTitle("Role")