let countNoti = 0

openNotifications()
getNoLeidos()
getParametersUrl()

function openNotifications() {
    document.getElementById("notiButton").addEventListener('click', async() => {

    })
}

function getParametersUrl() {
    var url_string = window.location.href
    var url = new URL(url_string)
    let deleted = url.searchParams.get("delete")
    let changeUrl = false

    if (deleted == 'true') {
        swal("Se Ha Eliminado Correctamente", "", "success")
        changeUrl = true
    } else if (deleted == 'false') {
        swal("Ocurrio Un Error De Eliminacion", "", "error")
        changeUrl = true
    }

    if (changeUrl) {
        var myUrlClean = "";
        window.history.pushState({}, document.title, "/gerencia" + myUrlClean);

    }

}

async function getNoLeidos() {

    let request = await fetch('/gerencia/cdg/deleteds/leidos/0', {
        method: "GET",
        headers: { 'Content-Type': 'application/json' }
    })
    let json = await request.json()
    document.querySelector(".dropdown-alerts").innerHTML = ''
    let countNoti = json.length
    if (json.length == 0) {

        let appendHtml = `<li>
            <a href = "#">
                <div>
                    <em class="fa fa-mail"></em>
                    No hay Notificaciones
                </div>
            </a>    
        </li>`
        document.querySelector(".dropdown-alerts").innerHTML = appendHtml
        document.getElementById('notifications').innerText = 0
    } else {
        document.getElementById('notifications').innerText = countNoti
        json.forEach((element, index) => {
            if (index === 0) {
                index = 1
            }
            let appendHTML = `
                <li id="${element.folio}" onclick="setLeido(this.id)">
                    <a href="#">
                            <div>
                                <em class="fa fa-user"></em> 
                                Se elimino ${element.folio}
                                <span class="pull-right text-muted small">${element.fecha}</span></div>
                    </a>
                </li>
                <li class="divider"></divider>
            `
            document.querySelector(".dropdown-alerts").innerHTML += appendHTML
        })

    }

}

async function setLeido(id) {

    let request = await fetch('/editar/leido/clg/' + id, { method: "PUT", headers: { 'Content-Type': 'application/json' } })
    let data = await request.json()
    console.log(data);
    window.location = data.redirect


}