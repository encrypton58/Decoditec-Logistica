const mysql = require('mysql')

const mysqlConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_almacen'
})


mysqlConn.connect((error) => {
    if (error) {
        console.log(error)
        return
    } else {
        console.log("db conectada")
    }
});

module.exports = mysqlConn;