function Areas() {
    let areas = [
        { area: 'Gerente General', redirect: '/gerencia' },
        { area: 'Tesoreria' },
        { area: 'Logistica y Tractos', redirect: '/tractos' },
        { area: 'Reporte de Cuenta De Operadores' },
        { area: 'Mantenimiento de Tractos', redirect: '/mantenimiento' },
        { area: 'Compras' },
        { area: 'Taller' },
        { area: 'Cuentas Por Cobrar' },
        { area: 'Recursos Humanos' },
        { area: 'Satelital', redirect: '/satelital' },
        { area: 'Camionetas', redirect: '/camionetas' },
        { area: 'Hiabs', redirect: '/hiabs' },
        { area: 'Canastillas', redirect: '/canastillas' },
        { area: 'Sistemas' }
    ]

    /* 'Gerente General',
    'Tesoreria',
    'Logistica y Tractos',
    'Reporte de Cuenta De Operadores',
    'Mantenimiento de Tractos',
    'Compras',
    'Taller',
    'Cuentas Por Cobrar',
    'Recursos Humanos',
    'Satelital',
    'Caminonetas',
    'Hiabs',
    'Canastillas',
    'Sistemas' */
    return areas
}

module.exports = Areas;