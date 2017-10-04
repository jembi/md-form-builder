'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbRadio.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (scope.field.skipLogic) {
        skipLogic.init(scope, elem, attrs, scope.field)
      }
    }
  }
}
