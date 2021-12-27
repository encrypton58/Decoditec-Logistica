let url = window.location.toString()
let auth
if (url.indexOf("autorizados") !== -1) {
    auth = "Autorizado"
} else {
    auth = "No Autorizado"
}

setOnclickListener()

function setOnclickListener() {
    document.querySelectorAll('.btn-auth').forEach((element) => {
        element.addEventListener('click', function(event) {
            autorizado(element)
        })
    })
}

async function filtrar() {
    let fecha1 = document.getElementById("inicial").value
    let fecha2 = document.getElementById("final").value
    let operador = document.getElementById("operador").value
    let unidad = document.getElementById("unidad").value

    let urlSearch = `/filtrar/cdg/?fecha1=${fecha1}&fecha2=${fecha2}&operador=${operador}&unidad=${unidad}&auth=${auth}`

    let request = await fetch(urlSearch, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let json = await request.json()
    document.getElementById('cdgtable').innerHTML = ''
    if (json.length > 0) {

        json.map((gasto) => {
            actualizarTabla(gasto)
        })
        mostrarEnTablaTotal()
    } else {
        swal("No hay Datos Para Mostrar", "", "warning")
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
    let tdEliminar = document.createElement('td')
    tdEliminar.classList.add("text-center")
    let tdSpace = document.createElement('td')
    let tdSpace1 = document.createElement('td')
    let tdSpace2 = document.createElement('td')
    let authButton = document.createElement('button')
    authButton.disabled = true
    authButton.classList.add(((gasto.auth == "No Autorizado") ? "btn-primary" : "btn-secondary"), "btn")
    authButton.textContent = ((gasto.auth == "No Autorizado") ? "Marcar Autorizado" : "Autorizado")
    tdImprimir.appendChild(authButton)
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
    let h4 = document.createElement('h4')
    let b = document.createElement('b')
    b.innerText = `Total De Consulta: $${totalDeConsulta}.00`
    h4.appendChild(b)
    tdTotalDeConsulta.classList.add('text-center')
    tdTotalDeConsulta.appendChild(h4)
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
async function autorizado(button) {

    let optionsRequest = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ auth: 1 })
    }

    let request = await fetch('/editar/auth/cdg/' + button.id, optionsRequest)
    let json = await request.json()

    if (json.auth) {
        button.disabled = true
        button.classList.remove("btn-primary")
        button.classList.remove("btn-secondary")
        button.textContent = "Autorizado"
    }

    console.log(json);


}