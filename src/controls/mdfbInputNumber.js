'use strict'

var skipLogic = require('../utils/skipLogic')()
var asyncValidator = require('../validators/asyncValidator')()

module.exports = function ($compile, $parse) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbInputNumber.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      // convert value to Int incase its a string
      scope.field.value = parseInt(scope.field.value)

      if (scope.field.skipLogic) {
        skipLogic.init(scope, elem, attrs, scope.field)
      }

      if (scope.field.validation) {
        asyncValidator.init(scope, scope.field, scope.globals)
      }
    }
  }
}
