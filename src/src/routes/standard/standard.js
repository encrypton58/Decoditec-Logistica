const e = require('express')
const router = e.Router()
const controladorStandar = require('../../controllers/Standard/ControladorStandar')
const comprobarToken = require('../../auth/ComprobarToken')
const verificarToken = require('../../auth/VerificarToken')

const db = require('../../database/db')
    //const verificarArea = require('../../auth/VerificarArea')

router.post('/cdg/registrar', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandar.registrarEnControlDeGastos)

router.post('/get/last/register/', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.ultimoRegistroDeControlDeGastos)

router.get('/registrar/cdg', controladorStandar.redireccionConArea)

router.get('/registrar/cdg/:area', controladorStandar.vistaDeRegistroCdG)

router.delete('/eliminar/cdg/:folio', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.eliminarGasto)

router.put('/editar/leido/clg/:folio', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.editarLeido)

router.put('/editar/auth/cdg/:folio', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.setAuth)

router.get('/ver/cdg', controladorStandar.verControlDeGastos)

router.get('/filtrar/cdg/', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.filtrarCdg)

router.get('/get/gastos', controladorStandar.obtenerGastos)

router.get('/generar/solicitud/pdf/cdg/:folio', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken, controladorStandar.crearSDGO)

// router.get('/solicitud/pdf/cdg', (req, res, next) => verificarToken(req, res, next, db),
//     comprobarToken,
//     controladorStandar.mostrarPdfGenerado)

module.exports = router