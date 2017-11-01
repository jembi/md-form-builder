'use strict'

var skipLogic = require('../utils/skipLogic')()
var asynchValidator = require('../validators/asynchValidator')()

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbInputPhoneNumber.html',
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

      if (scope.field.validation) {
        asynchValidator.init(scope, scope.field, scope.globals)
      }
    }
  }
}
