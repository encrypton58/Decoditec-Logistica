//GLOBAL VARIABLES
let hiabs
let totalDinero
let unidadAndFolio
let requestAutoFolio
let getUnidadesRequest
let url = window.location.toString();

console.log(url, url.indexOf('tractos') !== -1);

if (url.indexOf('Tractos') !== -1) {
    unidadAndFolio = "TRA-"
    requestAutoFolio = "/get/last/register/"
    getUnidadesRequest = "/ver/unidades/table/tractos"
} else if (url.indexOf('Hiabs') !== -1) {
    unidadAndFolio = "HIB-"
    requestAutoFolio = "/hiabs/rdcdg/get/ur"
    getUnidadesRequest = "/ver/unidades/table/hiabs"
} else if (url.indexOf("Canastillas" !== -1)) {
    unidadAndFolio = "CAN-"
    requestAutoFolio = "/get/last/register/"
    getUnidadesRequest = "/ver/unidades/table/canastillas"
} else if (url.indexOf('Camionetas') !== -1) {
    unidadAndFolio = "CAM-"
    requestAutoFolio = "/get/last/register/"
    getUnidadesRequest = "/ver/unidades/table/camionetas"
}

let valoresDeGastos = {
        comidas: 0,
        hospedaje: 0,
        recargas: 0,
        casetas: 0,
        combustible: 0,
        pension: 0,
        gg: 0,
        otros: 0,
    }
    //Obtiene todos los hiabs de la base de datos

fetch(getUnidadesRequest, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(async(res) => {
    hiabs = await res.json()
    for (let i = 0; i < hiabs.length; i++) {
        let option = document.createElement('option')
        option.id = i
        option.textContent = unidadAndFolio + hiabs[i].economico
        option.value = hiabs[i].economico
        document.getElementById("economico").appendChild(option)
    }

})




//Dispara el evento de seleccion del economico
document.getElementById("economico").addEventListener('change', () => {
    let positionArray = document.getElementById("economico").options[document.getElementById("economico").selectedIndex].id
    document.getElementById("unidad").value = hiabs[positionArray].marca + " " +
        hiabs[positionArray].submarca + " " + hiabs[positionArray].modelo
})



document.getElementById("autoFolio").addEventListener('change', async() => {
    if (document.getElementById("autoFolio").checked) {
        document.getElementById("folio").disabled = true
        let folioAuto
        if (folioAuto === undefined) {
            console.log("se hace");
            let optionsRequest = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ area: unidadAndFolio })
            }
            let request = await fetch('/get/last/register/', optionsRequest)
            let response = await request.json()
            console.log(response);
            if (response.folio == 0) {
                folioAuto = document.getElementById("folio").value + "001"
            } else {
                let folioNumber = response.folio.substr(response.folio.length - 3)
                let suma = parseInt(folioNumber) + 1
                if (suma < 10) {
                    folioAuto = response.folio.substr(0, response.folio.length - 3) + "00" + suma
                } else if (suma < 100) {
                    folioAuto = response.folio.substr(0, response.folio.length - 3) + "0" + suma
                } else {
                    folioAuto = response.folio.substr(0, response.folio.length - 3) + suma
                }
            }




        }
        document.getElementById("folio").value = folioAuto
    } else {
        document.getElementById("folio").disabled = false
        document.getElementById("folio").value = unidadAndFolio
    }
})

document.getElementById("fecha").addEventListener('change', () => {

    Date.prototype.getWeekNumber = function() {
        var d = new Date(+this) //Creamos un nuevo Date con la fecha de "this".
        d.setHours(0, 0, 0, 0) //Nos aseguramos de limpiar la hora.
        d.setDate(d.getDate() + 4 - (d.getDay() || 7)) // Recorremos los días para asegurarnos de estar "dentro de la semana"
            //Finalmente, calculamos redondeando y ajustando por la naturaleza de los números en JS:
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7)
    };
    // la fecha viene en formato yyyy-mm-dd
    let f = document.getElementById("fecha").value;

    let fecha = new Date(f);
    fecha.setDate(fecha.getDate());

    document.getElementById("semana").value = fecha.getWeekNumber()

})

document.getElementById("registrar").addEventListener('click', async() => {
    let folio = document.getElementById("folio")
    let fecha = document.getElementById("fecha")
    let semana = document.getElementById("semana")
    let operador = document.getElementById("operador")
    let economico = document.getElementById("economico")
    let unidad = document.getElementById("unidad")
    let comidas = document.getElementById("comidas")
    let hospedaje = document.getElementById("hospedaje")
    let recargas = document.getElementById("recargas")
    let casetas = document.getElementById("casetas")
    let combustible = document.getElementById("combustible")
    let pension = document.getElementById("pension")
    let gastos_generales = document.getElementById("gg")
    let otros = document.getElementById("otros")
    let observaciones = document.getElementById("observaciones")
    let total = document.getElementById("total")

    folio.parentNode.parentNode.classList.add((folio.value) ? 'has-success' : 'has-error')
    fecha.parentNode.parentNode.classList.add((fecha.value) ? 'has-success' : 'has-error')
    semana.parentNode.parentNode.classList.add((semana.value) ? 'has-success' : 'has-error')
    operador.parentNode.parentNode.classList.add((operador.value) ? 'has-success' : 'has-error')
    economico.parentNode.parentNode.classList.add((economico.value != "null") ? 'has-success' : 'has-error')
    unidad.parentNode.parentNode.classList.add((unidad.value) ? 'has-success' : 'has-error')
    comidas.parentNode.parentNode.classList.add((comidas.value) ? 'has-success' : 'has-error')
    hospedaje.parentNode.parentNode.classList.add((hospedaje.value) ? 'has-success' : 'has-error')
    recargas.parentNode.parentNode.classList.add((recargas.value) ? 'has-success' : 'has-error')
    casetas.parentNode.parentNode.classList.add((casetas.value) ? 'has-success' : 'has-error')
    combustible.parentNode.parentNode.classList.add((combustible.value) ? 'has-success' : 'has-error')
    pension.parentNode.parentNode.classList.add((pension.value) ? 'has-success' : 'has-error')
    gastos_generales.parentNode.parentNode.classList.add((gastos_generales.value) ? 'has-success' : 'has-error')
    otros.parentNode.parentNode.classList.add((otros.value) ? 'has-success' : 'has-error')
    observaciones.parentNode.parentNode.classList.add((observaciones.value) ? 'has-success' : 'has-error')
    total.parentNode.parentNode.classList.add((total.value) ? 'has-success' : 'has-error')

    setTimeout(() => {
        folio.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        economico.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        fecha.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        semana.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        operador.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        economico.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        unidad.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        comidas.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        hospedaje.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        recargas.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        casetas.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        combustible.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        pension.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        gastos_generales.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        otros.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        observaciones.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        total.parentNode.parentNode.classList.remove('has-success' && 'has-error')
    }, 5000);

    if (folio.value && fecha.value && semana.value && operador.value && economico.value && unidad.value &&
        comidas.value && hospedaje.value && recargas.value && casetas.value && combustible.value && pension.value &&
        gastos_generales.value && otros.value && observaciones.value && total.value) {

        if (folio.value.length < 7) {
            swal("El folio necesita el formato HIB-000, TRA-000, CAN-000 o CAM-000", "", "warning")
            return
        }

        let cdg = {
            folio: folio.value,
            fecha: fecha.value,
            semana: semana.value,
            operador: operador.value,
            economico: economico.value,
            unidad: unidad.value,
            comidas: comidas.value,
            hospedaje: hospedaje.value,
            recargas: recargas.value,
            casetas: casetas.value,
            combustible: combustible.value,
            pension: pension.value,
            gastos_generales: gastos_generales.value,
            otros: otros.value,
            observaciones: observaciones.value,
            total: total.value
        }

        let optionsRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cdg)
        }
        document.getElementById('spinner').classList.add('loader')
        document.getElementById('showTextLoader').classList.remove('loader-hidden')
        let request = await fetch('/cdg/registrar', optionsRequest)
        let response = await request.json()
        console.log(response);
        if (!response.tokenError && response.registrado) {
            document.getElementById('spinner').classList.remove('loader')
            document.getElementById('showTextLoader').classList.add('loader-hidden')
            document.getElementById('sdm').reset()
            swal("Se ha Registrado", "La unidad ha sido agregada", "success")
        } else if (!response.registrado) {
            swal("Ha ocurrido un error con el registro", "Probablemente ya esta registrado ese tracto", "warning")
        } else if (response.err == "DataNoFull") {
            swal("Faltan Datos", "Falta informacion por llenar", "warning")
        } else {
            swal("Ha ocurrido un error con el sistema", "llama al encargado del sistema", "error")
        }


    } else {
        alert("falta")
    }

})

document.querySelectorAll('input[type=number]').forEach((input, index) => {
    input.addEventListener('change', (event) => {

        valoresDeGastos[event.target.id] = parseInt(event.target.value)

        totalDinero = valoresDeGastos.comidas + valoresDeGastos.hospedaje + valoresDeGastos.recargas +
            valoresDeGastos.casetas + valoresDeGastos.combustible + valoresDeGastos.pension + valoresDeGastos.gg +
            valoresDeGastos.otros

        document.getElementById("total").value = totalDinero

    })
})