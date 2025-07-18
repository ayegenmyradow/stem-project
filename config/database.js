const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "",
  user: "stem-group",
  password: "",
  database: "stem_group",
  waitForConnections: true,
  connectionLimit: 100,
  maxIdle: 100,
  idleTimeout: 60000,
  queueLimit: 0,
});

pool.getConnection(function (err, conn) {
  conn.query(`SELECT 1`);
  pool.releaseConnection(conn);
});

module.exports = pool;







// CREATE USER 'stem-group'@'%' IDENTIFIED BY '';
// GRANT ALL PRIVILEGES ON stem_group.* TO 'stem-group'@'%';
// SHOW GRANTS FOR 'stem-group'@'%';

// const crypto = require('crypto')
// console.log(crypto.createHash('md5').update('hello world').digest('hex'))
