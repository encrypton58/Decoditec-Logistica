const db = require('../../database/db')
const ControlDeGastos = require('../../models/Normalizados/ControlDeGastos');
const Areas = require('../../models/Users/Areas')
const fs = require('fs');
const { json } = require('express');

function registrarEnControlDeGastos(req, res) {
    console.log(req.body);

    let folio = req.body.folio
    let fecha = req.body.fecha
    let semana = req.body.semana
    let operador = req.body.operador
    let economico = req.body.economico
    let unidad = req.body.unidad
    let comidas = req.body.comidas
    let hospedaje = req.body.hospedaje
    let recargas = req.body.recargas
    let casetas = req.body.casetas
    let combustible = req.body.combustible
    let pension = req.body.pension
    let gastos_generales = req.body.gastos_generales
    let otros = req.body.otros
    let observaciones = req.body.observaciones
    let total = req.body.total

    if (folio && fecha && semana && operador && economico && unidad && comidas && hospedaje && recargas &&
        casetas && combustible && pension && gastos_generales && otros && observaciones && total) {

        let cdg = new ControlDeGastos(folio, fecha, semana, operador, economico, unidad,
            comidas, hospedaje, recargas, casetas, combustible, pension, gastos_generales,
            otros, observaciones, total)


        db.query('INSERT INTO control_de_gastos SET ?', [cdg], (err, results, fields) => {
            if (err) {
                res.json({ err: "Database Error" })
            } else {
                if (results.affectedRows > 0) {
                    res.json({ registrado: true })
                } else {
                    res.json({ registrado: false })
                }
            }
        })
    } else {
        res.json({ err: 'noDataFull' })
    }
}

function obtenerGastos(req, res) {

    if (req.query.auth) {
        db.query(`SELECT * FROM control_de_gastos WHERE folio LIKE '%${req.query.area}%' AND auth LIKE '%${req.query.auth}%'`, (err, results) => {

            if (err) {
                console.log(err);
                res.sendStatus(500)
            } else {
                console.log(results);
                res.json(results)
            }

        })

    } else {
        db.query(`SELECT * FROM control_de_gastos WHERE folio LIKE '%${req.query.area}%'`, (err, results) => {
            if (err) {
                console.log(err);
                res.sendStatus(500)
            } else {
                console.log(results);
                res.json(results)
            }
        })

    }


}

function eliminarGasto(req, res) {

    let folio = req.params.folio
    let motivo = req.body.motivo

    db.query('SELECT * FROM control_de_gastos WHERE folio = ? LIMIT 1', [folio], (err, results, fields) => {
        if (err) {
            res.sendStatus(500)
        } else {
            let json = JSON.stringify(results[0])
            cdg = {
                folio,
                motivo,
                cdg: json
            }
            db.query('INSERT INTO eliminaciones_cdg SET ?', [cdg], (err, results, fields) => {
                if (err) {
                    res.sendStatus(500)
                } else {
                    if (results.affectedRows > 0) {
                        db.query('DELETE FROM control_de_gastos WHERE folio = ?', [folio], (err, results, fields) => {
                            if (err) {
                                res.sendStatus(500)
                            } else {
                                if (results.affectedRows > 0) {
                                    res.json({ eliminado: true })
                                } else {
                                    res.json({ eliminado: false })
                                }
                            }
                        });
                    } else {
                        res.json({ eliminado: false })
                    }

                }
            })
        }

    })
}

function editarLeido(req, res) {

    let folio = req.params.folio

    db.query('UPDATE eliminaciones_cdg SET leido = 1 WHERE folio = ?', [folio], (err, results) => {
        if (err) {
            res.json({ database: "DatabaseError" })
        } else {
            if (results.affectedRows > 0) {
                res.json({ redirect: '/gerencia/gasto/eliminado/' + folio })
            } else {
                res.json({ leido: false })
            }
        }
    })

}

function ultimoRegistroDeControlDeGastos(req, res) {

    let area = req.body.area.substr(0, req.body.area.length - 1)

    db.query("SELECT folio FROM control_de_gastos WHERE folio LIKE '%" + area + "%' ORDER BY folio DESC LIMIT 1",
        (err, results, fields) => {
            if (err) {
                console.log(err);
                res.json({ 'err': 'Database Error' })
            } else {
                if (results.length == 0) {
                    res.json({ folio: 0 })
                } else {
                    res.json({ folio: results[0].folio })
                }
            }
        })

}

function getAllTypeUnidades(res, folio, auth, callback) {

    if (auth) {
        db.query(`SELECT * FROM control_de_gastos WHERE folio LIKE '%${folio}%' AND auth = "No Autorizado"`, (err, results, fields) => {
            if (err) {
                console.log(err);
                res.json({ err: "505" })
            } else {
                if (results.length > 0) {
                    callback(results)
                } else {
                    callback([{ cdg: 'empty' }])
                }
            }
        })
    } else {
        db.query(`SELECT * FROM control_de_gastos WHERE folio LIKE '%${folio}%'`, (err, results, fields) => {
            if (err) {
                console.log(err);
                res.json({ err: "505" })
            } else {
                if (results.length > 0) {
                    callback(results)
                } else {
                    callback([{ cdg: 'empty' }])
                }
            }
        })
    }
}

function getAutorizados(req, res, callback) {
    db.query(`SELECT * FROM control_de_gastos WHERE auth = "Autorizado"`, (err, results) => {
        if (err) {
            console.log(err);
            res.json({ err: "Database Error" })
        } else {
            callback(results)
        }
    })
}

function verControlDeGastos(req, res) {

    if (req.session.user) {
        let area = req.session.user.area
        let name = req.session.user.nombre
        let areas = new Areas();

        if (areas[2].area == area) {
            //getAllTypeUnidades(req, res, true, callback)
            getAllTypeUnidades(res, "TRA-", false, (results) => {
                res.render('tractos/verControlDeGastos.pug', { username: name, cdgs: results })
            })
        } else if (areas[11].area == area) {
            getAllTypeUnidades(res, "HIB-", false, (results) => {
                res.render('hiabs/verControlDeGastos.pug', { username: name, cdgs: results })
            })
        } else if (areas[12].area == area) {
            getAllTypeUnidades(res, "CAN-", false, (results) => {
                res.render('canastillas/verContolGastos.pug', { username: name, cdgs: results })
            })
        } else if (areas[0].area == area) {

            db.query(`SELECT * FROM (
                SELECT economico, marca, submarca, modelo FROM canastillas 
                UNION SELECT economico, marca, submarca, modelo FROM tractos 
                UNION SELECT economico, marca, submarca, modelo FROM hiabs 
                UNION SELECT economico, marca, submarca, modelo FROM camionetas )
                 A ORDER BY economico ASC

            `, (err, results) => {
                if (err) {
                    res.redirect('/error/500')
                } else {
                    let unidades = results
                    getAllTypeUnidades(res, "-", true, (results) => {
                        res.render('gerencia/VerGastos.pug', { username: name, cdgs: results, unidades })
                    })
                }
            })

        } else {
            res.redirect("/error/403")
        }
    } else {
        res.redirect("/?err=noSessionToken")
    }


}

function redireccionConArea(req, res) {

    if (req.session.user) {
        let area = req.session.user.area
        let areas = new Areas();

        if (areas[2].area == area) {
            res.redirect('/registrar/cdg/Tractos')
        } else if (areas[11].area == area) {
            res.redirect('/registrar/cdg/Hiabs')
        } else if (areas[12].area == area) {
            res.redirect('/registrar/cdg/Canastillas')
        } else {
            res.redirect("/error/403")
        }

    } else {
        res.redirect("/?err=noSessionToken")
    }
}

function vistaDeRegistroCdG(req, res) {

    if (req.session.user) {
        let area = req.params.area
        let areas = new Areas();
        let name = req.session.user.nombre
        if ("Tractos" == area) {
            res.render('tractos/controlDeGastos.pug', { username: name })
        } else if (areas[11].area == area) {
            res.render('hiabs/controlDeGastos.pug', { username: name })
        } else if (areas[12].area == area) {
            res.render('canastillas/controlDeGastos.pug', { username: name })
        } else {
            res.redirect("/error/404")
        }
    } else {
        res.redirect('/?err=noSessionToken')
    }

}

function crearSDGO(req, res) {
    db.query('SELECT * FROM control_de_gastos WHERE folio = ? LIMIT 1', [req.params.folio], (err, results, fields) => {
        if (err) {
            console.log(err);
        } else {
            console.log(results);
            results[0].solicitante = req.session.user.nombre
            devolverPdf(res, results[0])
        }
    })
}

function devolverPdf(res, rdg) {

    const moment = require('moment')
    moment.locale('es')
    let fecha = moment(rdg.fecha).format("LL")

    let departamento

    if (rdg.folio.substr(0, 3) == "HIB") {
        departamento = "HIABS"
    } else if (rdg.folio.substr(0, 3) === "TRA") {
        departamento = "TRACTOS"
    } else if (rdg.folio.substr(0, 3) === "CAN") {
        departamento = "CANASTILLAS"
    } else if (rdg.folio.substr(0, 3) === "CAM") {
        departamento = "CAMIONETAS"
    }

    let rd = {
        folio: rdg.folio,
        fecha: fecha,
        departamento: departamento,
        unidad: rdg.unidad,
        economico: rdg.economico,
        operador: rdg.operador,
        comidas: rdg.comidas,
        hospedaje: rdg.hospedaje,
        recargas: rdg.recargas,
        casetas: rdg.casetas,
        combustible: rdg.combustible,
        pension: rdg.pension,
        gastos_generales: rdg.gastos_generales,
        otros: rdg.otros,
        observaciones: rdg.observaciones,
        total: rdg.total,
        solicitante: rdg.solicitante,
    }

    console.log(rd);

    res.render('templates/Pdf/SDGO.pug', { rd })

    // const pdf = require('html-pdf')
    //     const html = fs.readFileSync('./public/pdf/templates/SDGO.html', 'utf-8');
    // const html = setDataInTemplate(rdg)
    // let opciones = {
    //     "fortmat": "letter",
    //     "orientation": "portrait",
    //     "base": 'http://127.0.0.1:4000/'
    // }

    // pdf.create(html, opciones).toFile('./public/pdf/hiabs/salida.pdf', (err, result) => {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         res.redirect('/solicitud/pdf/cdg')
    //             work it -> res.download("./public/pdf/hiabs/salida.pdf")
    //     }
    // })



}

function mostrarPdfGenerado(req, res) {

    var data = fs.readFileSync('./public/pdf/hiabs/salida.pdf');
    res.contentType("application/pdf");
    res.send(data);

}

// function setDataInTemplate(rdg) {

//     const moment = require('moment')
//     moment.locale('es')
//     let fecha = moment(rdg.fecha).format("LL")

//     let departamento

//     if (rdg.folio.substr(0, 3) == "HIB") {
//         departamento = "HIABS"
//     } else if (rdg.folio.substr(0, 3) === "TRA") {
//         departamento = "TRACTOS"
//     } else if (rdg.folio.substr(0, 3) === "CAN") {
//         departamento = "CANASTILLAS"
//     } else if (rdg.folio.substr(0, 3) === "CAM") {
//         departamento = "CAMIONETAS"
//     }

//     let html = `<!DOCTYPE html>
//     <html lang="es">

//     <head>
//         <meta charset="UTF-8">
//         <title>Solicitud De Gastos</title>
//         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

//     </head>

//     <body>
//         <div class="container-fluid">
//             <br>
//             <div class="row">
//                 <div class="col-4 text-center">
//                     <img alt="Decoditec" style="width: 300px; height: 150px;" src="../../assets/images/ico.jpeg" />
//                 </div>
//                 <div class="col-6 text-center">
//                     <br>
//                     <h4>
//                         <b> DECODITEC LOGÍSTICA <br> SOLICITUD DE GASTOS OPERATIVOS </b>
//                     </h4>
//                 </div>
//             </div>
//             <br>
//             <div class=" row ">
//                 <div class="col-6 ">
//                     <h4><b>FOLIO</b>: ${rdg.folio}</h4>
//                 </div>
//                 <div class="col-5 ">
//                     <h5>${fecha}</h5>
//                 </div>
//             </div>
//             <br>
//             <div class="row ">
//                 <div class="col-12 ">
//                     <h6><b>DEPARTAMENTO:</b> ${departamento}</h6>
//                     <h6><b>SOLICITANTE:</b> ${rdg.solicitante}</h6>
//                     <h6><b>TIPO DE GASTO:</b> Gasto Operativo ${departamento}</h6>
//                     <h6><b>UNIDAD:</b> ${rdg.unidad} <b>Economico: </b>${rdg.economico}</h6>
//                     <h6><b>OPERADOR:</b> ${rdg.operador}</h6>
//                 </div>
//             </div>
//             <br>
//             <div class="row">
//                 <div class="col-6 offset-2">
//                     <table class="table" style="height: 200px;">
//                         <thead>
//                             <tr>
//                                 <th>
//                                     <b>CONCEPTOS</b>
//                                 </th>
//                                 <th>
//                                     <b>IMPORTES</b>
//                                 </th>
//                                 <th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr>
//                                 <td>
//                                     Comidas
//                                 </td>
//                                 <td>
//                                     $${rdg.comidas}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Hospedajes
//                                 </td>
//                                 <td>
//                                     $${rdg.hospedaje}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Recargas
//                                 </td>
//                                 <td>
//                                     $${rdg.recargas}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Casetas
//                                 </td>
//                                 <td>
//                                     $${rdg.casetas}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Combustible
//                                 </td>
//                                 <td>
//                                     $${rdg.combustible}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Pension
//                                 </td>
//                                 <td>
//                                     $${rdg.pension}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Gastos Generales
//                                 </td>
//                                 <td>
//                                     $${rdg.gastos_generales}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Otros
//                                 </td>
//                                 <td>
//                                     $${rdg.otros}.00
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     Obsevaciones
//                                 </td>
//                                 <td>
//                                     ${rdg.observaciones}
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td>
//                                     <b>TOTAL DE CONCEPTOS</b>
//                                 </td>
//                                 <td>
//                                     <b>$${rdg.total}.00</b>
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//             <br>
//             <div class="row text-center">
//                 <div class="col-5 text-center ">
//                     <h3>
//                         <b>AUTORIZADO</b>
//                     </h3>
//                     <br>
//                     <p>_______________________________</p>
//                     <h4>Lic. Rubén Valencia López</h4>
//                 </div>
//                 <div class="col-5 text-center ">
//                     <h3>
//                         <b>SOLICITA</b>
//                     </h3>
//                     <br>
//                     <p>_______________________________</p>
//                     <h4>Enc. ${rdg.solicitante}</h4>
//                 </div>
//             </div>
//         </div>


//     </body>

//     </html>`

//     return html
// }

function filtrarCdg(req, res) {

    if (req.query.fecha1 && req.query.fecha2 && req.query.unidad && req.query.operador) {

        db.query(`SELECT * FROM control_de_gastos WHERE economico = ? AND fecha BETWEEN ? AND ? AND operador LIKE '%${req.query.operador}%' AND auth = ?`, [req.query.unidad, req.query.fecha1, req.query.fecha2, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })

    } else if (req.query.fecha1 && req.query.fecha2 && !req.query.unidad && !req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE fecha BETWEEN ? AND ? AND auth = ?`, [req.query.fecha1, req.query.fecha2, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else if (!req.query.fecha1 && !req.query.fecha2 && req.query.unidad && req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE economico = ? AND operador LIKE '%${req.query.operador}%' AND auth = ?`, [req.query.unidad, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else if (req.query.fecha1 && req.query.fecha2 && !req.query.unidad && req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE fecha BETWEEN ? AND ? AND operador LIKE '%${req.query.operador}%' AND auth = ?`, [req.query.fecha1, req.query.fecha2, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else if (req.query.fecha1 && req.query.fecha2 && req.query.unidad && !req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE fecha BETWEEN ? AND ? AND economico = ? AND auth = ?`, [req.query.fecha1, req.query.fecha2, req.query.unidad, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else if (!req.query.fecha1 && !req.query.fecha2 && !req.query.unidad && req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE operador LIKE '%${req.query.operador}%' AND auth = ?`, [req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else if (!req.query.fecha1 && !req.query.fecha2 && req.query.unidad && !req.query.operador) {
        db.query(`SELECT * FROM control_de_gastos WHERE economico = ? AND auth = ?`, [req.query.unidad, req.query.auth], (err, results) => {
            if (err) {
                console.log(err);
                res.json({ err: "Database Error" })
            } else {
                res.json(results)
            }
        })
    } else {
        res.json({ err: "noAllParameters" })
    }

}

function setAuth(req, res) {
    console.log(req.params);
    db.query(`UPDATE control_de_gastos SET auth = 'Autorizado' WHERE folio = ?`, [req.params.folio], (err, results) => {
        if (err) {
            console.log(err);
            res.json({ err: "Database Error" })
        } else {
            if (results.affectedRows > 0) {
                res.json({ auth: true })
            } else {
                res.json({ auth: false })
            }
        }
    })
}

module.exports = {
    registrarEnControlDeGastos,
    ultimoRegistroDeControlDeGastos,
    verControlDeGastos,
    crearSDGO,
    mostrarPdfGenerado,
    vistaDeRegistroCdG,
    redireccionConArea,
    eliminarGasto,
    obtenerGastos,
    editarLeido,
    filtrarCdg,
    setAuth,
    getAutorizados,
}