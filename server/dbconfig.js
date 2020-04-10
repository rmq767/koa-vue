const mysql = require('mysql')
const co = require('co-mysql')

let conn = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'19980327',
    database:'node1'
})

module.exports = co(conn)