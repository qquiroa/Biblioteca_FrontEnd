import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const graphql = require('graphql-client')({
    url: "http://127.0.0.1:8000/graphql"
})

Vue.prototype.$graphql =
    (query, variables) => graphql.query(query, variables).then(response => {
        //console.log(response)
        return {
            'message': 'OK',
            'data': response.data
        }
    }).catch(e => {
        console.log(e)
        return {
            'message': 'ERROR',
            'error': e
        }
    })

Vue.prototype.$date = date => {
    const format_date = new Date(date)
    const week_day = ['Domingo', 'Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes', 'SÃ¡bado']
    const month = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    const result = week_day[format_date.getDay()] + ', ' + format_date.getDate() + ' de ' + month[format_date.getMonth()] + ' del ' + format_date.getFullYear()
    return result
}
