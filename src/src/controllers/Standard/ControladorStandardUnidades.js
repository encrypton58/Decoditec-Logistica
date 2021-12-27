const unidad = require('../../models/Normalizados/Unidad')
const db = require('../../database/db');

function registrarUnidades(req, res) {
    let name = req.session.user.nombre
    if (req.query.unidades == "tractos") {
        res.render('tractos/registrarUnidades.pug', { username: name })
    } else if (req.query.unidades == "hiabs") {
        res.render('hiabs/registrarHiabs.pug', { username: name })
    } else if (req.query.unidades == "canastillas") {
        res.render('canastillas/registrarUnidades.pug', { username: name })
    } else {
        res.sendStatus(404)
    }

}

function verUnidades(req, res) {
    let name = req.session.user.name
    if (req.query.unidades == "tractos") {
        db.query("SELECT * FROM tractos ", (err, results, fields) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.render('tractos/verUnidades.pug', { username: name, unidades: results })
            }
        })

    } else if (req.query.unidades == "hiabs") {

        db.query("SELECT * FROM hiabs ", (err, results) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.render('hiabs/verHiabs.pug', { username: name, unidades: results })
            }
        })

    } else if (req.query.unidades == "canastillas") {
        db.query('SELECT * FROM canastillas', (err, results, fields) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.render('canastillas/verUnidades.pug', { username: name, unidades: results })
            }
        })
    } else {
        res.sendStatus(404)
    }
}

function eliminar(req, res) {
    let arrayIds = req.body.params
    let table = req.params.table
    db.query("DELETE FROM " + table + " WHERE economico IN (?)", [arrayIds], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.redirect("/error/500")
        } else {
            console.log(results);
            res.json({ delete: true })
        }
    })
}

function editar(req, res) {
    let table = req.params.table
    let unidadEditar = new unidad(req.body.economico, req.body.marca, req.body.submarca,
        req.body.placas, req.body.modelo, req.body.combustible, req.body.serie,
        req.body.serie_de_motor, req.body.motor)
    db.query(`UPDATE ${table} SET ? WHERE economico = ?`, [unidadEditar, req.body.economico], (err, results, fields) => {
        if (err) {
            console.log(err);
            res.json({ err: "Database Error" })
        } else {
            if (results.affectedRows > 0) {
                res.json({ registrado: true })
            } else {
                res.json({ registrado: false })
            }
        }
    })
}

function getUnicaUnidad(req, res) {
    let eco = req.query.eco
    let tabla = req.params.table
    db.query(`SELECT * FROM ${tabla} WHERE economico = ${eco}`, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.json({ err: "505" })
        } else {
            if (results.length > 0) {
                res.json({ hiab: results[0] })
            }
        }
    })
}

function obtenerTodasLasUnidades(req, res) {
    let table = req.params.table
    db.query(`SELECT * FROM ${table}`, (err, results, fields) => {
        if (err) {
            console.log(err);
            res.json({ err: "505" })
        } else {
            if (results.length > 0) {
                res.json(results)
            }
        }
    })
}

function registrar(req, res) {

    if (req.body.economico && req.body.marca && req.body.placas &&
        req.body.modelo && req.body.combustible && req.body.serie) {
        let unidadRegistrar = new unidad(req.body.economico, req.body.marca, req.body.submarca, req.body.placas, req.body.modelo, req.body.combustible, req.body.serie, req.body.serie_de_motor, req.body.motor)
        db.query("INSERT INTO " + req.params.table + " SET ?", [unidadRegistrar], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                if (results.affectedRows > 0) {
                    res.json({ registrado: true })
                } else {
                    res.json({ registrado: false })
                }
            }
        })
    } else {
        res.json({ err: "DataNoFull" })
    }

}


module.exports = {
    registrarUnidades,
    registrar,
    verUnidades,
    eliminar,
    editar,
    getUnicaUnidad,
    obtenerTodasLasUnidades
}