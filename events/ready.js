const db=require("../database/db.js");

module.exports = async(client) => {

  //guild db check
  const guildsInCache = client.guilds.cache.values();
  client.guildPrefixes= new Map(); 
  for await (guild of guildsInCache){
    await guild.members.fetch();
    await guild.roles.fetch();
    await db.query(`SELECT * FROM guild WHERE id='${guild.id}';`)
    .then(async (rows) => {
      if(rows.length==0){
        await db.query(`INSERT INTO guild VALUES('${guild.id}', '${client.config.defaultPrefix}', null);`).then() 
        client.guildPrefixes.set(guild.id, client.config.defaultPrefix);
      }
      else{
        const prefix = await db.query(`SELECT prefix FROM guild WHERE id='${guild.id}';`).then(rows =>{return rows[0]["prefix"]});
        client.guildPrefixes.set(guild.id, prefix);
      }
    });
  }

  //participation
  const participationRows = await db.query(`SELECT * FROM participation`);
  for(row of participationRows){
    const guild = await client.guilds.resolve(row.guild_id);
    
    if(!guild){ 
      await db.query(`DELETE FROM participation WHERE guild_id=${row.guild_id}`)
    }
    else if(!guild.members.cache.has(row.user_id)){
      await db.query(`DELETE FROM participation WHERE user_id=${row.user_id} AND guild_id=${row.guild_id}`)
    }
  }

  //size_roles
  const sizeRoleRows = await db.query(`SELECT * FROM size_role`)
  for(row of sizeRoleRows){
    const guild = await client.guilds.resolve(row.guild_id);

    if(!guild){ 
      await db.query(`DELETE FROM size_role WHERE guild_id=${row.guild_id}`)
    }
    else if(!guild.roles.cache.has(row.role_id)){
      await db.query(`DELETE FROM size_role WHERE role_id=${row.role_id} AND guild_id=${row.guild_id}`)
    }
  }

  client.uploadChannels = new Array();
  const channelsRaw = await db.query(`SELECT upload_channel FROM guild;`);

  for(channel of channelsRaw){
    client.uploadChannels.push(channel["upload_channel"])
  }
  
  console.log(client.user.username+" is ready!")
  client.user.setActivity(`${client.config.defaultPrefix}help`, {type: "WATCHING"});
};