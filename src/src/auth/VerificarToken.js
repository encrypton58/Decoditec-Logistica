const verify_token = (req, res, next, db) => {
    const bearerHeader = (req.session.user) ? 'Bearer ' + req.session.user.token : undefined
    if (bearerHeader != undefined) {
        db.query('SELECT * FROM close_sessions WHERE invalid_token = ?', [bearerHeader.split(" ")[1]], (err, result, fields) => {
            if (!err) {
                if (result.length > 0) {
                    console.log(result);
                    res.redirect('/?err=tokenInvalid')
                } else {
                    if (typeof bearerHeader !== 'undefined') {
                        const bearerToken = bearerHeader.split(" ")[1]
                        req.token = bearerToken
                        next();
                    } else {
                        console.log('token is undefined');
                        res.sendStatus(403)
                    }
                }
            } else {
                console.log(err)
            }
        })
    } else {
        res.redirect('/?err=noSessionToken')
    }


}

module.exports = verify_token;