'use strict'

var idValidate = require('./south-african-id-number-validator').validate

module.exports = function ($compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      checkIdNumber: '=checkIdNumber'
    },
    link: function (scope, element, attributes, ngModel) {
      scope.$watch('checkIdNumber', function (newValue, oldValue) {
        // do not validate the ID number
        if (!newValue) {
          // always return true as we are not validating anymore
          ngModel.$validators.checkIdNumber = function () {
            return true
          }
          ngModel.$validate()
        } else {
          // add validator for ID number
          ngModel.$validators.checkIdNumber = function (modelValue) {
            return idValidate(modelValue).isValid
          }
          ngModel.$validate()
        }
      }, true)
    }
  }
}
