let url1 = window.location.toString()
let tabla

if (url1.indexOf('2') !== -1 && url1.indexOf('tractos') !== -1) {
    tabla = "tractos"
} else if (url1.indexOf('11') !== -1 && url1.indexOf('hiabs') !== -1) {
    tabla = "hiabs"
} else if (url1.indexOf('12') !== -1 && url1.indexOf('canastillas') !== -1) {
    tabla = "canastillas"
} else if (url1.indexOf('10') !== -1 && url1.indexOf('camionetas') !== -1) {
    table = "camionetas"
}

let registar = document.getElementById('registrar')
if (registar) {
    registar.addEventListener('click', async(evt) => {

        let economico = document.getElementById('economico')
        let marca = document.getElementById('marca')
        let submarca = document.getElementById('subMarca')
        let placas = document.getElementById('placas')
        let modelo = document.getElementById('modelo')
        let combustible = document.getElementById('combustible')
        let serie = document.getElementById('serie')
        let serieMotor = document.getElementById('noMotor')
        let motor = document.getElementById('motor')

        economico.parentNode.parentNode.classList.add((economico.value) ? 'has-success' : 'has-error')
        marca.parentNode.parentNode.classList.add((marca.value) ? 'has-success' : 'has-error')
        placas.parentNode.parentNode.classList.add((placas.value) ? 'has-success' : 'has-error')
        modelo.parentNode.parentNode.classList.add((modelo.value) ? 'has-success' : 'has-error')
        combustible.parentNode.parentNode.classList.add((combustible.value != "null") ? 'has-success' : 'has-error')
        serie.parentNode.parentNode.classList.add((serie.value) ? 'has-success' : 'has-error')

        setTimeout(() => {
            economico.parentNode.parentNode.classList.remove('has-success' && 'has-error')
            marca.parentNode.parentNode.classList.remove('has-success' && 'has-error')
            placas.parentNode.parentNode.classList.remove('has-success' && 'has-error')
            modelo.parentNode.parentNode.classList.remove('has-success' && 'has-error')
            combustible.parentNode.parentNode.classList.remove('has-success' && 'has-error')
            serie.parentNode.parentNode.classList.remove('has-success' && 'has-error')
        }, 5000);

        if (economico.value && marca.value &&
            placas.value && modelo.value && combustible.value != "null" && serie.value) {

            let unidad = new Unidad(economico.value.trim(), marca.value.trim(),
                submarca.value.trim(), placas.value.trim(), modelo.value.trim(), combustible.value.trim(), serie.value.trim(), serieMotor.value.trim(), motor.value.trim())

            console.log(unidad);


            let optionsRequest = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(unidad)
            }

            document.getElementById('spinner').classList.add('loader')
            document.getElementById('showTextLoader').classList.remove('loader-hidden')
            let request = await fetch('/registrar/unidades/tabla/' + tabla, optionsRequest)
            let response = await request.json()
            console.log(response);
            if (!response.tokenError && response.registrado) {
                document.getElementById('formRegister').reset()
                document.getElementById('spinner').classList.remove('loader')
                document.getElementById('showTextLoader').classList.add('loader-hidden')
                swal("Se ha Registrado", "La unidad ha sido agregada", "success")
            } else if (!response.registrado) {
                swal("Ha ocurrido un error con el registro", "Probablemente ya esta registrado ese tracto", "warning")
            } else if (response.err == "DataNoFull") {
                swal("Faltan Datos", "Falta informacion por llenar", "warning")
            } else {
                swal("Ha ocurrido un error con el sistema", "llama al encargado del sistema", "error")
            }
        } else {
            swal("Faltan Datos", "Faltan Datos Por llenar", "warning")
        }

    })

}


function Unidad(economico, marca, submarca, placas, modelo, combustible, noSerie, serieMotor, motor) {
    this.economico = economico
    this.marca = marca
    this.submarca = submarca
    this.placas = placas
    this.modelo = modelo
    this.combustible = combustible
    this.serie = noSerie
    this.serie_de_motor = serieMotor
    this.motor = motor
}