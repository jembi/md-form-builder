'use strict'

module.exports = function ($compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      regexValidation: '=regexValidation'
    },
    link: function (scope, element, attributes, ngModel) {
      scope.$watch('regexValidation', function (regexValidation, oldVal) {
        if (!regexValidation.regexValidation || !regexValidation.apply) {
          ngModel.$validators.regexValidation = function () {
            return true
          }
          return ngModel.$validate()
        }

        if (regexValidation.apply) {
          ngModel.$validators.regexValidation = function (modelValue) {
            return new RegExp(regexValidation.regexValidation.regex).test(modelValue)
          }
          ngModel.$validate()
        }
      }, true)
    }
  }
}
