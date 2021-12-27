function dashboard(req, res) {
    let name = req.session.user.nombre
    res.render('canastillas/dashboard.pug', { username: name })
}

function verControlDeGastos(req, res) {
    let name = req.session.user.nombre
    res.render('canastillas/controlDeGastos.pug', { username: name })
}

module.exports = {
    dashboard,
    verControlDeGastos
}