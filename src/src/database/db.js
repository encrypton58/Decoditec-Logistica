const mysql = require('mysql')

const connect = mysql.createConnection({
    host: 'mysql-logistica.alwaysdata.net',
    user: 'logistica',
    password: 'marcusclasic2',
    database: 'logistica_admin',
    dateStrings: 'date'
})


connect.connect((err) => {
    if (err) {
        console.log("bad conf")
    } else {
        console.log("good conf")
    }
})

con = connect


module.exports = con;