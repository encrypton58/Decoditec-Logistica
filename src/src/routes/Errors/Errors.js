//Cofigurations
const e = require("express");
const router = e.Router()

//Controllers
const controladorDeVistas = require("../../controllers/Errors/ControllerErrors");

//Retorna la vista en caso que se requiera por un error 500
router.get('/error/500', controladorDeVistas.returnViewError500)

router.get('/error/403', controladorDeVistas.returnError403)

router.get('/error/404', controladorDeVistas.returnError404)

module.exports = router;