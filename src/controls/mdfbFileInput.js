'use strict'

var skipLogic = require('../utils/skipLogic')()
var asyncValidator = require('../validators/asyncValidator')()

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbFileInput.html',
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

      scope.change = function () {
        var file = scope.form.file.$$element[0].files[0]
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function () {
          var base64String = reader.result
          scope.field.value = base64String
        }
      }
    }
  }
}
