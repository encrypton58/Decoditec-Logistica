const Areas = require('../../models/Users/Areas')
    // Retorna la vista del login
function vistaDeLogin(req, res) {
    if (req.query.correo) {
        let user = req.query.correo
        res.render('login/login.pug', { correo: user })
        console.log("aqui esta");
    } else {
        res.render('login/login.pug')
    }
}

function vistaDeRegistro(req, res) {
    res.render('login/signup.pug')
}

function vistaDependidendoArea(req, res, user, token) {
    let areas = new Areas();
    for (let i = 0; i <= areas.length; i++) {

        if (user.area == areas[i].area) {
            res.redirect(areas[i].redirect)
            break
        }
    }
}

module.exports = {
    vistaDeLogin,
    vistaDependidendoArea,
    vistaDeRegistro
}