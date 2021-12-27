function returnViewError500(req, res) {
    res.render('errors/error_500.pug')
}

function returnError403(req, res) {
    res.render("errors/error_403.pug")
}

function returnError404(req, res) {
    res.render('errors/error_404.pug')
}

module.exports = {
    returnViewError500,
    returnError403,
    returnError404
}