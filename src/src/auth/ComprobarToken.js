const jwt = require('jsonwebtoken')

function comprobarToken(req, res, next) {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.redirect('/?err=invalidToken')
            res.json({ err: "TokenError" })
        } else {
            next()
        }
    })
}

module.exports = comprobarToken