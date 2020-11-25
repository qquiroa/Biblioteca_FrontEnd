"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].prototype.$axios = _axios["default"];

var graphql = require('graphql-client')({
  url: "http://127.0.0.1:8000/graphql"
});

_vue["default"].prototype.$graphql = function (query, variables) {
  return graphql.query(query, variables).then(function (response) {
    console.log(response);
    return {
      'message': 'OK',
      'data': response.data
    };
  })["catch"](function (e) {
    console.log(e);
    return {
      'message': 'ERROR',
      'error': e
    };
  });
};

_vue["default"].prototype.$date = function (date) {
  var format_date = new Date(date);
  var week_day = ['Domingo', 'Lunes', 'Martes', 'MiÃ©rcoles', 'Jueves', 'Viernes', 'SÃ¡bado'];
  var month = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var result = week_day[format_date.getDay()] + ', ' + format_date.getDate() + ' de ' + month[format_date.getMonth()] + ' del ' + format_date.getFullYear();
  return result;
};