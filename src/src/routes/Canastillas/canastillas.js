const e = require('express')
const router = e.Router()
const db = require('../../database/db')
const controladorDeVistas = require('../../controllers/Canastillas/ControladorDeVistas')
    //const controladorDeTractos = require('../../controllers/Tractos/ControladorDeTractos')
const verificarArea = require('../../auth/VerificarArea')
const verificarToken = require('../../auth/VerificarToken')
const comprobarToken = require('../../auth/ComprobarToken')
let nombreDeArea = "Canastillas"


router.get('/canastillas', (req, res, next) => {
    verificarArea(req, res, next, nombreDeArea)
}, controladorDeVistas.dashboard)

router.get('/canastillas/cdg', (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistas.verControlDeGastos)

module.exports = router