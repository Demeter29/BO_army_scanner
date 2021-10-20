const mysql=require("mysql2");
const config = require("../config.json")

const db = mysql.createPool({
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
});

function query(sql, inserts){
    return new Promise( (resolve) =>{ 
        db.query(sql, inserts, (err, rows) =>{        
            if(err){
                console.log("Database error: "+err);
            }
            else resolve(rows);                               
        });
    });
};

exports.query = query;