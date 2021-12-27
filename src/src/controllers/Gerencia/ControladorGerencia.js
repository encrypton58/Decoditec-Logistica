const db = require('../../database/db')
const moment = require('moment')

function getEliminacionesDeGastos(req, res) {

    db.query('SELECT COUNT(*) AS registros FROM eliminaciones_cdg WHERE leido = 0', (err, result) => {
        if (err) {
            console.log(err);
            res.json({ err: "databaseError" })
        } else {
            res.json(result)
        }
    })

}

function getEliminacionesDeGastosNoLeidas(req, res) {
    db.query('SELECT id, folio, motivo, leido, fecha FROM eliminaciones_cdg WHERE leido = 0', (err, results) => {
        if (err) {
            console.log(err);
            res.json({ err: "databaseError" })
        } else {

            results.map((row) => {
                let moments = moment(row.fecha).fromNow()
                row.fecha = moments
            })

            res.json(results)
        }
    })
}

function gastoEliminado(req, res, callback) {

    db.query('UPDATE eliminaciones_cdg SET leido = 1 WHERE folio = ?', [req.params.folio], (err, results) => {
        if (err) {
            res.json({ database: "DatabaseError" })
        } else {
            if (results.affectedRows > 0) {
                console.log("ok");
            } else {
                console.log("no ok :c");
            }
        }
    })
    db.query('SELECT * FROM eliminaciones_cdg WHERE folio = ? LIMIT 1', [req.params.folio], (err, results) => {
        if (err) {

            res.redirect("/error/500")

        } else {

            callback(results[0])
        }

    })
}

function gastosEliminados(req, res, render) {
    db.query('SELECT * FROM eliminaciones_cdg ORDER BY fecha DESC', (err, results) => {
        if (err) {
            res.sendStatus(500)
        } else {
            render(results)
        }

    })
}

function eliminacionDeGasto(req, res) {
    db.query("DELETE FROM eliminaciones_cdg WHERE id = ?", [req.body.id], (err, results) => {
        if (err) {
            console.log(err);
            res.redirect('/error/500')
        } else {
            if (results.affectedRows > 0) {
                res.redirect('/gerencia?delete=true')
            }
        }
    })
}

module.exports = {
    getEliminacionesDeGastos,
    getEliminacionesDeGastosNoLeidas,
    gastoEliminado,
    gastosEliminados,
    eliminacionDeGasto
}