function ControlDeGastos(folio, fecha, semana, operador, economico,
    unidad, comidas, hospedaje, recargas, casetas, combustible, pension,
    gastos_generales, otros, observaciones, total) {
    this.folio = folio
    this.fecha = fecha
    this.semana = semana
    this.operador = operador
    this.economico = economico
    this.unidad = unidad
    this.comidas = comidas
    this.hospedaje = hospedaje
    this.recargas = recargas
    this.casetas = casetas
    this.combustible = combustible
    this.pension = pension
    this.gastos_generales = gastos_generales
    this.otros = otros
    this.observaciones = observaciones
    this.total = total
}

module.exports = ControlDeGastos