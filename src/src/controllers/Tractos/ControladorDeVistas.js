const controladorDeTractos = require('./ControladorDeTractos')

function dashboard(req, res) {
    let name = req.session.user.nombre
    res.render('tractos/dashboard.pug', { username: name })
}

function verControlDeGastos(req, res) {
    let name = req.session.user.nombre
    controladorDeTractos.getCDGTractos(res, (results) => {
        res.render('tractos/verControlDeGastos.pug', { username: name, cdgs: results })
    })

}

module.exports = {
    dashboard,
    verControlDeGastos
}