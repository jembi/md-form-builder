'use strict'

var validate = function (idNumber) {
  var identityNumberValidatorResult = {
    isValid: true,
    errorMessage: ''
  }

  if (idNumber === null || idNumber === 'undefined' || idNumber.length != 13 || isNaN(idNumber)) {
    identityNumberValidatorResult.errorMessage = 'Identity number supplied is not a valid length or is not a number'
    identityNumberValidatorResult.isValid = false
    return identityNumberValidatorResult
  }

  // Extract the date of birth
  var derivedDob = new Date(idNumber.substring(0, 2), idNumber.substring(2, 4) - 1, idNumber.substring(4, 6))

  if (!((derivedDob.getYear() == idNumber.substring(0, 2)) && (derivedDob.getMonth() == idNumber.substring(2, 4) - 1) &&
    (derivedDob.getDate() == idNumber.substring(4, 6)))) {
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
    multiplier = (multiplier % 2 == 0) ? 1 : 2
  }

  if ((checkSum % 10) != 0) {
    identityNumberValidatorResult.errorMessage = 'Identity Number supplied check digit validation failed'
    identityNumberValidatorResult.isValid = false
    return identityNumberValidatorResult
  }

  return identityNumberValidatorResult
}

exports.validate = validate
