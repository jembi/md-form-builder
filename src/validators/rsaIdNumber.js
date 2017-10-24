'use strict'

var moment = require('moment')

module.exports = function ($compile) {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      checkRsaIdNumber: '=checkRsaIdNumber'
    },
    link: function (scope, element, attributes, ngModel) {
      scope.$watch('checkRsaIdNumber', function (newValue, oldValue) {
        setValidity(newValue)
      }, true)

      var setValidity = function (value) {
        // do not validate the ID number
        if (!value) {
          // always return true as we are not validating anymore
          ngModel.$validators.checkRsaIdNumber = function () {
            return true
          }
          ngModel.$validate()
        } else {
          // add validator for ID number
          ngModel.$validators.checkRsaIdNumber = function (modelValue) {
            return rsaIdValidate(modelValue).isValid
          }
          ngModel.$validate()
        }
      }

      var rsaIdValidate = function (idNumber) {
        var identityNumberValidatorResult = {
          isValid: true,
          errorMessage: ''
        }

        if (idNumber === null || idNumber === 'undefined' || idNumber.length !== 13 || isNaN(idNumber)) {
          identityNumberValidatorResult.errorMessage = 'Identity number supplied is not a valid length or is not a number'
          identityNumberValidatorResult.isValid = false
          return identityNumberValidatorResult
        }

        // Extract the date of birth and check if valid
        var derivedDobValid = moment(idNumber.substring(0, 6), 'YYMMDD').isValid()

        if (!(derivedDobValid)) {
          identityNumberValidatorResult.errorMessage = 'Identity number supplied has an invalid date of birth'
          identityNumberValidatorResult.isValid = false
        }

        // apply Luhn formula for check-digits
        var tempTotal = 0
        var checkSum = 0
        var multiplier = 1
        for (var i = 0; i < 13; ++i) {
          tempTotal = parseInt(idNumber.charAt(i)) * multiplier
          if (tempTotal > 9) {
            tempTotal = parseInt(tempTotal.toString().charAt(0)) + parseInt(tempTotal.toString().charAt(1))
          }
          checkSum = checkSum + tempTotal
          multiplier = (multiplier % 2 === 0) ? 1 : 2
        }

        if ((checkSum % 10) !== 0) {
          identityNumberValidatorResult.errorMessage = 'Identity Number supplied check digit validation failed'
          identityNumberValidatorResult.isValid = false
          return identityNumberValidatorResult
        }

        return identityNumberValidatorResult
      }

      return {
        setValidity: setValidity,
        rsaIdValidate: rsaIdValidate
      }
    }
  }
}
