'use strict'

module.exports = function ($compile, $parse) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbInputNumber.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      // convert value to Int incase its a string
      scope.field.value = parseInt(scope.field.value)

      if (scope.field.skipLogic) {
        initSkipLogicInputNumber(scope, elem, attrs, scope.field)
      }
    }
  }
}

var initSkipLogicInputNumber = function (scope, elem, attrs, formField) {
  // add watchers for any logical functions which need to be executed based on a form variable
  if (formField.skipLogic.func) {
    angular.forEach(formField.skipLogic.func.watchingVars, function (watchingVar, key) {
      var varToWatch = 'form.' + watchingVar + '.$viewValue'
      scope.$watch(varToWatch, function (value, oldValue) {
        var params = formField.skipLogic.func.params
        var paramsObj = {}
        for (var p = 0; p < params.length; p++) {
          if (scope.form[params[p]]) {
            paramsObj[params[p]] = scope.form[params[p]].$modelValue
          } else {
            if (typeof params[p] === 'object') {
              for (var key in params[p]) {
                if (params[p].hasOwnProperty(key)) {
                  paramsObj[key] = params[p][key]
                }
              }
            } else {
              paramsObj[params[p]] = params[p]
            }
          }
        }

        var funcVal = formField.skipLogic['func'].execute(paramsObj)
        scope.form[scope.field.name].$setViewValue(funcVal)
        scope.form[scope.field.name].$setUntouched()
        scope.form[scope.field.name].$setPristine()
        scope.form[scope.field.name].$render()
      })
    })
  }

  // add watchers for any logic checks (show/hide)
  if (formField.skipLogic.checks.length > 0) {
    for (var i = 0; i < formField.skipLogic.checks.length; i++) {
      // console.log(formField.skipLogic.checks[i])
      var check = formField.skipLogic.checks[i]
      scope.$watch(check.variable, function (value, oldValue) {
        var operators = {
          '=': function (a, b) { return a === b },
          '!=': function (a, b) { return a !== b },
          '<': function (a, b) { return a < b },
          '<=': function (a, b) { return a <= b },
          '>': function (a, b) { return a > b },
          '>=': function (a, b) { return a >= b }
        }

        if (operators[check.operand](value, check.value)) {
          scope.field.show = true
        } else {
          scope.field.show = false
        }
      }, true)
    }
  }
}
