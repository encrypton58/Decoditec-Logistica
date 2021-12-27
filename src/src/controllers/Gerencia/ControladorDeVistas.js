const controladorGerencia = require('../../controllers/Gerencia/ControladorGerencia')
const { getAutorizados } = require('../../controllers/Standard/ControladorStandar')
const db = require('../../database/db')

function dashboard(req, res) {
    let name = req.session.user.nombre
    res.render('gerencia/Dashboard.pug', { username: name })
}

function gastosEliminados(req, res) {
    let name = req.session.user.nombre
    controladorGerencia.gastosEliminados(req, res, (results) => {
        res.render('gerencia/GastosEliminados.pug', { username: name, ecdg: results })
    })

}

function gastosRegistrados(req, res) {
    let name = req.session.user.nombre

    db.query(`SELECT * FROM (
        SELECT economico, marca, submarca, modelo FROM canastillas 
        UNION SELECT economico, marca, submarca, modelo FROM tractos 
        UNION SELECT economico, marca, submarca, modelo FROM hiabs 
        UNION SELECT economico, marca, submarca, modelo FROM camionetas )
         A ORDER BY economico ASC

    `, (err, results) => {
        if (err) {
            res.redirect('/error/500')
        } else {
            let unidades = results
            getAutorizados(req, res, (cdg) => {
                res.render('gerencia/GastosRegistrados.pug', { username: name, cdgs: cdg, unidades: unidades })
            })
        }
    })
}

function gastoEliminado(req, res) {
    let name = req.session.user.nombre
    controladorGerencia.gastoEliminado(req, res, (results) => {
        res.render('gerencia/GastoEliminado.pug', { username: name, cdg: results })
    })
}

module.exports = {
    dashboard,
    gastosEliminados,
    gastosRegistrados,
    gastoEliminado
}