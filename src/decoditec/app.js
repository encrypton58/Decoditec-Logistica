const express = require('express')
const app = express()
var favicon = require('serve-favicon');
const session = require('express-session')

app.set('view engine', 'pug')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

app.use(require('./src/routes/standard/standardUnidades'))
app.use(require('./src/routes/login/login'))
app.use(require('./src/routes/Errors/Errors'))
app.use(require('./src/routes/Hiabs/hiabs'))
app.use(require('./src/routes/tractos/tractos'))
app.use(require('./src/routes/standard/standard'))
app.use(require('./src/routes/Gerencia/gerencia'))
app.use(require('./src/routes/Canastillas/canastillas'))
app.use(express.static(__dirname + "/public/"))
app.use(express.static(__dirname + "/node_modules/"))
app.use(favicon(__dirname + '/public/assets/images/ico.ico'));

app.listen(process.env.PORT, function() {
    console.log('Example app started!')
})