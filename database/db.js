const mysql=require("mysql2");
const config = require("../config.json");
const { abbreviateNumber } = require("js-abbreviation-number");

const pool = mysql.createPool({
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

let db = new Object;

db.query = async (sql, inserts) =>{
    return new Promise( (resolve) =>{ 
        pool.query(sql, inserts, (err, rows) =>{        
            if(err){
                console.log("Database error: "+err);
            }
            else resolve(rows);                               
        });
    });
};

db.getMaxPartySizeData = async (guild) => {
    return await db.query(`SELECT username, max_party_size AS size FROM user INNER JOIN participation ON user.id=participation.user_id WHERE guild_id=${guild.id} ORDER BY max_party_size DESC`).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })

    
}

db.getT6TroopsData = async (guild) =>{
    return await db.query(`
    SELECT username, SUM(quantity.amount) AS 'T6 troops' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${guild.id}
    AND troop.tier=6
    GROUP BY username
    ORDER BY \`T6 troops\` DESC;
    `).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })
}

db.getT5PlusTroopsData = async (guild) => {
    return await db.query(`
    SELECT username, SUM(quantity.amount) AS 'T5/T6 troops' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${guild.id}
    AND (troop.tier=5 OR troop.tier=6)
    GROUP BY username
    ORDER BY \`T5/T6 troops\` DESC;
    `).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })
}

db.getGoldData = async (guild) => {
    return await db.query(`
    SELECT username, gold FROM user
    INNER JOIN participation ON user.id=participation.user_id
    WHERE guild_id=${guild.id}
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

db.getWageData = async (guild) => {
    return db.query(`
    SELECT username, SUM(quantity.amount*troop.wage)AS 'wages' FROM user 
    INNER JOIN participation ON user.id=participation.user_id 
    INNER JOIN quantity ON user.id=quantity.user_id 
    INNER JOIN troop ON quantity.troop_id=troop.id 
    WHERE guild_id=${guild.id}
    GROUP BY username  
    ORDER BY \`wages\` DESC;
    `).then(rows =>{
        for(let i=0;i<rows.length;i++){
            rows[i]= Object.assign({rank: "#"+(i+1)}, rows[i])
        }
        return rows;
    })
}


module.exports = db;