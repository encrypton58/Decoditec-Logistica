let value
let totalDeConsulta = 0

document.getElementById('eliminarCDG').addEventListener('click', function() {
    eliminarGasto()
})

setOnclickListener()

function setOnclickListener() {
    document.querySelectorAll('.btn-eliminar').forEach((element) => {
        element.addEventListener('click', function(event) {
            eliminarCDG(element)
        })
    })

}

function eliminarCDG(element) {

    value = element.id

    document.getElementById('exampleModalLabel').textContent = `Eliminacion de ${value}`

    $("#eliminarCdg").modal("show")

}

async function eliminarGasto() {
    let motivoText = document.getElementById('motivo').value

    if (motivoText.length > 0) {
        let motivo = { motivo: motivoText }
        let response = await fetch(`/eliminar/cdg/${value}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(motivo)
        });
        let data = await response.json()
        if (data.eliminado) {
            let response = await fetch("/get/gastos?area=" + value.substr(0, 3), { method: "GET", headers: { 'Content-Type': ' application/json' } })
            let data = await response.json()
            document.getElementById('cdgtable').innerHTML = ''
            console.log(data);
            data.forEach(gasto => {
                actualizarTabla(gasto)
            });
            mostrarEnTablaTotal()

            swal("Se ha eliminado correctamente", "", "success")
            document.getElementById('motivo').value = ''
            $("#eliminarCdg").modal("hide")

        } else {
            swal("No se pudo eliminar", "", "error")
        }

    } else {

        swal("Tienes Que agregar El Motivo", "", "warning")

    }


}

function actualizarTabla(gasto) {
    let tr = document.createElement('tr')
    let tdFolio = document.createElement('td')
    tdFolio.classList.add('text-center')
    tdFolio.innerText = gasto.folio
    let tdFecha = document.createElement('td')
    tdFecha.innerText = gasto.fecha
    let tdSemana = document.createElement('td')
    tdSemana.innerText = gasto.semana
    let tdOperador = document.createElement('td')
    tdOperador.innerText = gasto.operador
    let tdEconomico_Unidad = document.createElement('td')
    tdEconomico_Unidad.innerText = gasto.economico + " - " + gasto.unidad
    let tdDesglose = document.createElement('td')
    tdDesglose.classList.add('text-center')
    tdDesglose.innerHTML = `
                Comidas: $${gasto.comidas}.00 - Hospedaje: $${gasto.hospedaje}.00
                <div class="divider"></div>
                  Recargas: $${gasto.recargas}.00 - Casetas: $${gasto.casetas}.00
                  <div class="divider"></div>
                  Combustible: $${gasto.combustible}.00 - Pension: $${gasto.pension}.00
                  <div class="divider"></div>
                  Gastos Generales: $${gasto.gastos_generales}.00 - Otros: $${gasto.otros}.00
                  <div class="divider"></div>
                  Observaciones: ${gasto.observaciones}`
    let trControls = document.createElement('tr')
    let tdImprimir = document.createElement('td')
    let imprimirLink = document.createElement('a')
    imprimirLink.setAttribute('href', "/generar/solicitud/pdf/cdg/" + gasto.folio)
    imprimirLink.setAttribute('target', "_blank")
    imprimirLink.setAttribute('id', "imprimir")
    imprimirLink.classList.add("btn", "btn-primary")
    imprimirLink.textContent = `Impr ${gasto.folio}`
    tdImprimir.appendChild(imprimirLink)
    let tdEliminar = document.createElement('td')
    tdEliminar.classList.add("text-center")
    let eliminarBoton = document.createElement('button')
    eliminarBoton.id = gasto.folio
    eliminarBoton.classList.add('btn-eliminar')
    eliminarBoton.textContent = "Eliminar " + gasto.folio
    eliminarBoton.classList.add("btn", "btn-danger")
    tdEliminar.appendChild(eliminarBoton)
    let tdSpace = document.createElement('td')
    let tdSpace1 = document.createElement('td')
    let tdSpace2 = document.createElement('td')
    trControls.appendChild(tdImprimir)
    trControls.appendChild(tdEliminar)
    trControls.appendChild(tdSpace)
    trControls.appendChild(tdSpace1)
    trControls.appendChild(tdSpace2)
    let tdTotal = document.createElement('td')
    tdTotal.classList.add('text-center')
    totalDeConsulta += gasto.total
    tdTotal.textContent = `Total: $${gasto.total}.00`
    trControls.appendChild(tdTotal)

    tr.appendChild(tdFolio)
    tr.appendChild(tdFecha)
    tr.appendChild(tdSemana)
    tr.appendChild(tdOperador)
    tr.appendChild(tdEconomico_Unidad)
    tr.appendChild(tdDesglose)

    document.getElementById('cdgtable').appendChild(tr)
    document.getElementById('cdgtable').appendChild(trControls)

    setOnclickListener()

}

function mostrarEnTablaTotal() {
    let trTotalDeConsulta = document.createElement('tr')
    trTotalDeConsulta.classList.add('text-center')
    let tdTotalDeConsulta = document.createElement('td')
    tdTotalDeConsulta.classList.add('text-center')
    tdTotalDeConsulta.innerText = `Total: $${totalDeConsulta}.00`
    let tdSpace0 = document.createElement('td')
    let tdSpace1 = document.createElement('td')
    let tdSpace2 = document.createElement('td')
    let tdSpace3 = document.createElement('td')
    let tdSpace4 = document.createElement('td')

    trTotalDeConsulta.appendChild(tdSpace0)
    trTotalDeConsulta.appendChild(tdSpace1)
    trTotalDeConsulta.appendChild(tdSpace2)
    trTotalDeConsulta.appendChild(tdSpace3)
    trTotalDeConsulta.appendChild(tdSpace4)
    trTotalDeConsulta.appendChild(tdTotalDeConsulta)

    document.getElementById('cdgtable').appendChild(trTotalDeConsulta)
    totalDeConsulta = 0
}