//Configurations
const e = require("express")
let app = e()
const session = require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))
const router = e.Router()
const controladorDeLogin = require("../../controllers/Login/ControllerLogin")
    //Controllers
const controladorDeVistas = require("../../controllers/Login/ControllerLoginViews")


//retorna la vista para hacer el login
router.get('/', controladorDeVistas.vistaDeLogin)

router.get('/login/signup', controladorDeVistas.vistaDeRegistro)

router.get('/login/logout', controladorDeLogin.logout)

router.post('/login/signin', controladorDeLogin.login)

router.post('/login/register', controladorDeLogin.registrarUsuario)



//exporta el middleware
module.exports = router