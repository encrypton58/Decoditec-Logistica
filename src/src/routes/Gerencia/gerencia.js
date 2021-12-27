const e = require('express')
const router = e.Router()
const db = require('../../database/db')
const verificarArea = require('../../auth/VerificarArea')
const controladorDeVistas = require('../../controllers/Gerencia/ControladorDeVistas')
const controladorDeGerencia = require('../../controllers/Gerencia/ControladorGerencia')
const verificarToken = require('../../auth/VerificarToken')
const comprobarToken = require('../../auth/ComprobarToken')
let nombreDeArea = "Gerente General"

router.get('/gerencia', (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistas.dashboard)

router.get('/gerencia/cdg/deleteds', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorDeGerencia.getEliminacionesDeGastos)

router.get('/gerencia/cdg/deleteds/leidos/0', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorDeGerencia.getEliminacionesDeGastosNoLeidas)

router.get('/gerencia/gastos/eliminados', (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistas.gastosEliminados)

router.get('/gerencia/gastos/autorizados', (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistas.gastosRegistrados)

router.get('/gerencia/gasto/eliminado/:folio', (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    controladorDeVistas.gastoEliminado)

router.post('/gerencia/gasto/eliminado/eliminar', (req, res, next) => verificarToken(req, res, next, db),
    (req, res, next) => verificarArea(req, res, next, nombreDeArea),
    comprobarToken, controladorDeGerencia.eliminacionDeGasto)

module.exports = router