function dashboard(req, res) {
    let name = req.session.user.nombre
    res.render('hiabs/dashboard.pug', { username: name })
}




module.exports = {
    dashboard
}