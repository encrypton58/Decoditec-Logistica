//Configurations
const e = require("express")
const router = e.Router()
const controladorDeVistasHiabs = require('../../controllers/Hiabs/ControllerHiabsViews')
const verificarArea = require('../../auth/VerificarArea')
let NombreDeArea = 'Hiabs'


router.get('/hiabs', (req, res, next) => {

    verificarArea(req, res, next, NombreDeArea)

}, controladorDeVistasHiabs.dashboard)

module.exports = router