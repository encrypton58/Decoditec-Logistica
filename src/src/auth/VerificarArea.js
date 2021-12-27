const { vistaDependidendoArea } = require('../controllers/Login/ControllerLoginViews')

function verificarArea(req, res, next, nombreDeArea) {

    if (req.session.user) {
        if (req.session.user.area != nombreDeArea) {
            vistaDependidendoArea(req, res, req.session.user, req.session.user.token)
        } else {
            next()
        }
    } else {
        res.redirect('/?err=noSessionToken')
    }

}

module.exports = verificarArea