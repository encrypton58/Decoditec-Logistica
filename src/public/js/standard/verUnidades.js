let url = window.location.toString();
let table
if (url.indexOf('tractos') !== -1) {
    table = "tractos"
} else if (url.indexOf('hiabs') !== -1) {
    table = "hiabs"
} else if (url.indexOf('canastillas') !== -1) {
    table = "canastillas"
} else if (url.indexOf('camionetas') !== -1) {
    table = "camionetas"
}

document.getElementById('editar').addEventListener('click', async() => {

    if (document.querySelectorAll('input[type="checkbox"]:checked').length > 1) {
        swal("No se puede editar mas de un registro", "", "warning")
    } else if (document.querySelectorAll('input[type="checkbox"]:checked').length == 0) {
        swal("Necesitas Selecionar un Registro", "", "warning")
    } else {
        let eco = document.querySelectorAll('input[type="checkbox"]:checked')[0].id

        let optionsRequest = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }

        let request = await fetch(`/ver/unidad/tabla/${table}?eco=${eco}`, optionsRequest)
        let response = await request.json()

        //console.log(response);

        let economico = document.getElementById('economico')
        let marca = document.getElementById('marca')
        let submarca = document.getElementById('subMarca')
        let placas = document.getElementById('placas')
        let modelo = document.getElementById('modelo')
        let combustible = document.getElementById('combustible')
        let serie = document.getElementById('serie')
        let serieMotor = document.getElementById('noMotor')
        let motor = document.getElementById('motor')

        economico.value = response.hiab.economico
        marca.value = response.hiab.marca
        submarca.value = response.hiab.submarca
        placas.value = response.hiab.placas
        modelo.value = response.hiab.modelo
        serie.value = response.hiab.serie
        serieMotor.value = response.hiab.serie_de_motor
        motor.value = response.hiab.motor

        let opt = Array.from(combustible.options)
        for (let i = 0; i < opt.length; i++) {
            if (opt[i].text === response.hiab.combustible) {
                combustible.options[i].selected = true
                break
            }
        }

        $('#editarUnidad').modal('show')

    }



})

document.getElementById('editarSend').addEventListener('click', async() => {
    let economico = document.getElementById('economico')
    let marca = document.getElementById('marca')
    let submarca = document.getElementById('subMarca')
    let placas = document.getElementById('placas')
    let modelo = document.getElementById('modelo')
    let combustible = document.getElementById('combustible')
    let serie = document.getElementById('serie')
    let serieMotor = document.getElementById('noMotor')
    let motor = document.getElementById('motor')

    let unidad = new Unidad(economico.value.trim(), marca.value.trim(),
        submarca.value.trim(), placas.value.trim(), modelo.value.trim(), combustible.value.trim(), serie.value.trim(), serieMotor.value.trim(), motor.value.trim())

    // console.log(unidad);


    let optionsRequest = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unidad)
    }

    let request = await fetch(`/editar/unidad/table/${table}`, optionsRequest)
    let response = await request.json()

    //console.log(response);
    if (!response.tokenError && response.registrado) {
        let request = await fetch(`/ver/unidades/table/${table}`)
        let unidadesFetch = await request.json()
        console.log(unidadesFetch);
        actualizarTabla(unidadesFetch)
        document.getElementById('formRegister').reset()
        swal("Se ha Editado", "La unidad ha sido editada", "success")
    } else if (!response.registrado) {
        swal("Ha ocurrido un error con el registro", "Probablemente ya esta registrado ese tracto", "warning")
    } else if (response.err == "DataNoFull") {
        swal("Faltan Datos", "Falta informacion por llenar", "warning")
    } else {
        swal("Ha ocurrido un error con el sistema", "llama al encargado del sistema", "error")
    }

})

document.getElementById('eliminar').addEventListener('click', async() => {

    let params = []
    let bodyTable = document.getElementById("unidadesTable")
    let rowsToRemove = []
    let selectRows = document.querySelectorAll('input[type="checkbox"]:checked')

    for (let i = 0; i < selectRows.length; i++) {
        params.push(selectRows[i].id)
        rowsToRemove.push(selectRows[i].parentNode.parentNode)
    }

    if (params.length == 0) {
        swal("Debes seleccionar una fila", "Selecciona una fila para eliminarla", "warning")
    } else {
        swal({
            title: "Seguro que deseas eliminar",
            text: "Se eliminara de manera permanente la unidad",
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(async(isDelete) => {
            if (isDelete) {
                let optionsRequest = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ params: params })
                }
                const response = await fetch(`/eliminar/unidad/tabla/${table}`, optionsRequest)
                const data = await response.json()
                console.log(data);
                if (data.delete) {
                    for (let row of rowsToRemove) {
                        bodyTable.removeChild(row)
                    }
                    swal("Se elimino correctamente", "", "success")
                }
            } else {

            }
        })

    }
})

function actualizarTabla(unidad) {
    let bodyTable = document.getElementById('unidadesTable')
    bodyTable.innerHTML = ''
    unidad.forEach((tracto, index) => {
        let tr = document.createElement('tr')
        let tdOpciones = document.createElement('td')
        tdOpciones.classList.add('text-center')
        let input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.id = tracto.economico
        tdOpciones.appendChild(input)
        let tdEconomico = document.createElement('td')
        tdEconomico.textContent = tracto.economico
        let tdMarca = document.createElement('td')
        tdMarca.innerText = tracto.marca
        let tdSubmarca = document.createElement('td')
        tdSubmarca.innerText = tracto.submarca
        let tdPlacas = document.createElement('td')
        tdPlacas.innerText = tracto.placas
        let tdModelo = document.createElement('td')
        tdModelo.innerText = tracto.modelo
        let tdCombustible = document.createElement('td')
        tdCombustible.innerText = tracto.combustible
        let tdSerie = document.createElement('td')
        tdSerie.innerText = tracto.serie
        let tdSerieMotor = document.createElement('td')
        tdSerieMotor.innerText = tracto.serie_de_motor
        let tdmotor = document.createElement('td')
        tdmotor.innerText = tracto.motor
        tr.appendChild(tdOpciones)
        tr.appendChild(tdEconomico)
        tr.appendChild(tdMarca)
        tr.appendChild(tdSubmarca)
        tr.appendChild(tdPlacas)
        tr.appendChild(tdModelo)
        tr.appendChild(tdCombustible)
        tr.appendChild(tdSerie)
        tr.appendChild(tdSerieMotor)
        tr.appendChild(tdmotor)
        bodyTable.appendChild(tr)

    })
}