const mysql = require('mysql2');

const env = process.env;

const conn = mysql.createConnection({
    host : env.DB_HOST || 'localhost',
    user : env.DB_SER || 'root',
    password : env.DB_PASS || 'Erase una vez un rey',
    database : env.DB_DATABASE || 'nnfx-pretester',
});

conn.connect(function(err){
    if(err) throw err;
    console.log('Database is connected succesfully');
});

module.exports = conn;