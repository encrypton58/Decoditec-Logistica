const db = require('../../database/db')

function getCDGTractos(res, callback) {
    db.query("SELECT * FROM control_de_gastos WHERE folio LIKE '%TRA-%'", (err, results, fields) => {
        if (err) {
            console.log(err);
            res.json({ err: "505" })
        } else {
            if (results.length > 0) {
                callback(results)
            } else {
                callback([{ cdg: 'empty' }])
            }
        }
    })
}

function getTractos(res, callback) {
    db.query('SELECT * FROM tractos', (err, results, fields) => {
        if (err) {
            console.log(err);
            res.json({ err: "505" })
        } else {
            if (results.length > 0) {
                callback(results)
            } else {
                callback([{ hiabs: 'empty' }])
            }
        }
    })
}


module.exports = {
    getCDGTractos,
    getTractos
}