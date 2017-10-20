'use strict'

module.exports = function ($compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      regexValidation: '=regexValidation'
    },
    link: function (scope, element, attributes, ngModel) {
      scope.$watch('regexValidation', function (newVal, oldVal) {
        if (!newVal) {
          ngModel.$validators.regexValidation = function () {
            return true
          }
          return ngModel.$validate()
        }

        ngModel.$validators.regexValidation = function (modelValue) {
          return new RegExp(scope.regexValidation.regexValidation.regex).test(modelValue)
        }
        ngModel.$validate()
      }, true)
    }
  }
}
