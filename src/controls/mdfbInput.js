'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbInput.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (scope.field.settings.regexValidation) {
        scope.fieldRegexValidation = {
          regexValidation: scope.field.settings.regexValidation,
          show: !scope.form.saveAsDraft.$modelValue && scope.field.show
        }
      }

      if (scope.field.skipLogic) {
        skipLogic.init(scope, elem, attrs, scope.field)
      }
    }
  }
}
