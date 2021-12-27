const e = require('express')
const router = e.Router()
const db = require('../../database/db')
const controladorDeVistasDeTractos = require('../../controllers/Tractos/ControladorDeVistas')
const controladorDeTractos = require('../../controllers/Tractos/ControladorDeTractos')
const verificarArea = require('../../auth/VerificarArea')
const verificarToken = require('../../auth/VerificarToken')
const comprobarToken = require('../../auth/ComprobarToken')
let nombreDeArea = "Logistica y Tractos"

router.get('/tractos', (req, res, next) => {
    verificarArea(req, res, next, nombreDeArea)
}, controladorDeVistasDeTractos.dashboard)

router.get('/tractos/ver/cdg',
    (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistasDeTractos.verControlDeGastos)

router.get('/tractos/get/all',
    (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    (req, res) => {
        controladorDeTractos.getTractos(res, (results) => {
            res.json(results)
        })
    })

module.exports = router