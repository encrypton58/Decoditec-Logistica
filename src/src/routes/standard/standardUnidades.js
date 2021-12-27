const e = require('express')
const router = e.Router()
const controladorStandardUnidades = require('../../controllers/Standard/ControladorStandardUnidades')
const comprobarToken = require('../../auth/ComprobarToken')
const verificarToken = require('../../auth/VerificarToken')
const verificarArea = require('../../auth/VerificarArea')

const db = require('../../database/db')


router.get('/registrar/unidad/area/:area', (req, res, next) => {
        let a = require('../../models/Users/Areas')
        let areas = new a()
        verificarArea(req, res, next, areas[req.params.area].area)
    },
    (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.registrarUnidades)

router.get('/ver/unidades/area/:area', (req, res, next) => {
        let a = require('../../models/Users/Areas')
        let areas = new a()
        verificarArea(req, res, next, areas[req.params.area].area)
    }, (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.verUnidades)

router.get('/ver/unidad/tabla/:table', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.getUnicaUnidad)

router.get('/ver/unidades/table/:table', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.obtenerTodasLasUnidades)

router.post('/eliminar/unidad/tabla/:table', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.eliminar)

router.post('/editar/unidad/table/:table', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.editar)

router.post('/registrar/unidades/tabla/:table', (req, res, next) => verificarToken(req, res, next, db),
    comprobarToken,
    controladorStandardUnidades.registrar)

module.exports = router