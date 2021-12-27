const by = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../../database/db')
const users = require('../../models/Users/Users')
const { vistaDependidendoArea } = require('./ControllerLoginViews')

function login(req, res) {
    if (req.body.correo && req.body.pass) {
        db.query("SELECT * FROM users WHERE correo = ? LIMIT 1", [req.body.correo], (err, results, fields) => {
            if (err) {
                console.log(err);
                res.redirect('/error/500')
            } else {
                if (results.length > 0) {
                    by.compare(req.body.pass, results[0].pass, (err, value) => {

                        if (!err) {
                            if (value) {
                                //crea el usuario y genera el token si devuelve el callback true

                                let user = new users(results[0].id,
                                    results[0].nombre,
                                    req.body.correo,
                                    results[0].pass,
                                    results[0].area)

                                jwt.sign({ user: user }, "secretKey", (err, token) => {

                                    if (err) {
                                        res.redirect('/error/500')
                                    } else {
                                        delete user.pass
                                        user.token = token
                                        req.session.user = user
                                        vistaDependidendoArea(req, res, user, token)
                                    }
                                })
                            } else {
                                //devuelve el error de contraseña no compatible 
                                res.redirect('/?err=PasswordIncorrect&correo=' + results[0].correo)
                            }
                        } else {
                            res.redirect('/error/500')
                        }

                    })
                } else {
                    //devuelve error de usuario no encontrado
                    res.redirect('/?err=noFound')
                }
            }
        })
    } else {
        res.redirect('/?err=NoDataFull')
    }
}

function logout(req, res) {
    req.session.destroy();
    res.redirect('/')
}


function registrarUsuario(req, res) {
    if (req.body.nombre && req.body.correo && req.body.pass && req.body.area) {
        let encrypPass = by.hashSync(req.body.pass.trim(), 8)

        let user = new users(0, escapeRegExp(req.body.nombre.trim()),
            escapeRegExp(req.body.correo.trim()),
            encrypPass,
            escapeRegExp(req.body.area.trim()))

        db.query("INSERT INTO `users` SET ? ", [user], (err, results, fields) => {
            if (err) {
                res.redirect('/error/500')
            } else {
                res.redirect('/?user=1&correo=' + user.correo)
            }
        });
    } else {
        res.redirect('/login/signup?err=NoDataFull')
    }
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?,<>/^$|#]/g, '\\$&');
}

module.exports = {
    login,
    logout,
    registrarUsuario
}