'use strict'

module.exports = function () {
  var errorInAsyncValidations = function (errorName, asyncValidations) {
    var asyncValidationsWithTheError = asyncValidations.filter(function (validation) {
      return validation.key === errorName
    })
    return asyncValidationsWithTheError.length !== 0
  }

  var fieldIsValid = function (errors, asyncValidations) {
    for (var errorName in errors) {
      if (errors.hasOwnProperty(errorName)) {
        if (!errorInAsyncValidations(errorName, asyncValidations)) {
          return false
        }
      }
    }
    return true
  }

  var init = function (scope, formField, globals) {
    if (formField.validation && formField.validation.length > 0) {
      var varToWatch = 'form.' + formField.name + '.$viewValue'

      scope.$watch(varToWatch, function (value, oldValue) {
        var promises = []
        globals.validating = true
        formField.validation.forEach(function (validation) {
          if (typeof validation.execute === 'function' && fieldIsValid(scope.form[scope.field.name].$error, formField.validation)) {
            scope.form[scope.field.name].$setValidity(validation.key, true)
            scope.form[scope.field.name].$setTouched()
            var promise = validation.execute(value)
            promises.push(promise)
            promise.then(function () {
              scope.form[scope.field.name].$setValidity(validation.key, true)
              scope.$apply()
            }).catch(function () {
              scope.form[scope.field.name].$setValidity(validation.key, false)
              scope.$apply()
            })
          } else {
            scope.form[scope.field.name].$setValidity(validation.key, true)
          }
        })

        Promise.all(promises).then(function () {
          globals.validating = false
          scope.$apply()
        }).catch(function () {
          globals.validating = false
          scope.$apply()
        })
      })
    }
  }

  return {
    init: init
  }
}
