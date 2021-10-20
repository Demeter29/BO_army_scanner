const db=require("../database/db.js");

module.exports = async(client) => {

  const guildsInCache = client.guilds.cache.values();
  client.guildPrefixes= new Map(); 
  for await (guild of guildsInCache){
    await db.query(`SELECT * FROM guild WHERE id='${guild.id}';`)
    .then(async (rows) => {
      if(rows.length==0){
        await db.query(`INSERT INTO guild VALUES('${guild.id}', '${client.config.defaultPrefix}');`).then() 
        client.guildPrefixes.set(guild.id, client.config.defaultPrefix);
      }
      else{
        const prefix = await db.query(`SELECT prefix FROM guild WHERE id='${guild.id}';`).then(rows =>{return rows[0]["prefix"]});
        client.guildPrefixes.set(guild.id, prefix);
      }
    });
  }

  client.uploadChannels = new Array();

  const channelsRaw = await db.query(`SELECT upload_channel FROM guild;`);

  console.log(channelsRaw)
  for(channel of channelsRaw){
    client.uploadChannels.push(channel["upload_channel"])
  }
  
  console.log(client.user.username+" is ready!")
  client.user.setActivity(`${client.config.defaultPrefix}help`, {type: "WATCHING"});
};