'use strict'

module.exports = function () {
  var init = function (scope, formField, globals) {
    if (formField.validation && formField.validation.length > 0) {
      var varToWatch = 'form.' + formField.name + '.$viewValue'

      scope.$watch(varToWatch, function (value, oldValue) {
        var promises = []
        globals.validating = true
        formField.validation.forEach(function (validation) {
          if (typeof validation.execute === 'function') {
            scope.form[scope.field.name].$setValidity(validation.key, true)
            var promise = validation.execute(value)
            promises.push(promise)
            promise.then(function () {
              scope.form[scope.field.name].$setValidity(validation.key, true)
              scope.$apply()
            }).catch(function () {
              scope.form[scope.field.name].$setValidity(validation.key, false)
              scope.$apply()
            })
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
