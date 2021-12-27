var url_string = window.location.href
var url = new URL(url_string)
let err = url.searchParams.get("err")

if (err == "NoDataFull") {
    swal("Faltan Datos", "Escribe Todos los datos que se piden", "error")
}

var myUrlClean = "";
window.history.pushState({}, document.title, "/login/signup" + myUrlClean);


let check = document.getElementById('show_pass')
let isSendForm = {};

check.addEventListener('change', () => {

    if (check.checked) {
        document.getElementById('confirm_pass').setAttribute('type', 'text')
        document.getElementById('pass').setAttribute('type', 'text')
    } else {
        document.getElementById('confirm_pass').setAttribute('type', 'password')
        document.getElementById('pass').setAttribute('type', 'password')
    }

})

document.getElementById('pass').addEventListener('keyup', () => {
    if (document.getElementById('pass').value.length < 8) {
        $('#alertPassword').css('display', 'block')
        isSendForm.passL = true
    } else {
        $('#alertPassword').css('display', 'none')
        isSendForm.passL = false
    }
})

document.getElementById('confirm_pass').addEventListener('keyup', () => {

    let pass = document.getElementById('pass').value

    if (pass != document.getElementById('confirm_pass').value) {
        $('#alert').css('display', 'block')
        isSendForm.passE = true
    } else {
        $('#alert').css('display', 'none')
        isSendForm.passE = false
    }

})

document.getElementsByName('my-form')[0].addEventListener('submit', (evt) => {
    if (isSendForm.passE) {
        evt.preventDefault()
    }
    if (isSendForm.passL) {
        evt.preventDefault()
    }

})