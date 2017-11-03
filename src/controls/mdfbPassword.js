'use strict'

var skipLogic = require('../utils/skipLogic')()
var asyncValidator = require('../validators/asyncValidator')()

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbPassword.html',
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
        asyncValidator.init(scope, scope.field, scope.globals)
      }
    }
  }
}
