const mysql = require('mysql2');


const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  database: process.env.DB_NAME
});

module.exports = db;