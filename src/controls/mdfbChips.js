'use strict'

module.exports = function ($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbChips.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (!scope.field.value) {
        scope.field.value = []
      }

      if (scope.field.skipLogic) {
        initSkipLogicChips(scope, elem, attrs, $timeout, scope.field)
      }

      if (scope.field.transformFunc) {
        var varToWatch = 'form.' + scope.field.name + '.$viewValue'
        scope.$watch(varToWatch, function (value, oldValue) {
          for (var i = 0; i < value.length; i++) {
            if (!value[i].text) {
              var code = angular.copy(value[i].code)
              value[i].text = getSetOptionResult(scope.field.name, i, code)
            }
          }
        }, true)

        var getSetOptionResult = function (field, index, code) {
          scope.field.transformFunc(code).then(function (result) {
            var fieldValue = scope.form[field].$viewValue
            fieldValue[index] = result
            scope.form[field].$setViewValue(fieldValue)
            scope.form[field].$setUntouched()
            scope.form[field].$setPristine()
          }).catch(function (err) {
            return err
          })
        }

        scope.transformFunc = function (chip) {
          return { code: chip }
        }
      }
    }
  }
}

var initSkipLogicChips = function (scope, elem, attrs, $timeout, formField) {
  // add watchers for any logical functions which need to be executed based on a form variable
  if (formField.skipLogic.func) {
    angular.forEach(formField.skipLogic.func.watchingVars, function (watchingVar, key) {
      var varToWatch = 'form.' + watchingVar + '.$viewValue'
      scope.$watch(varToWatch, function (value, oldValue) {
        var params = formField.skipLogic.func.params
        var paramsObj = {}
        for (var p = 0; p < params.length; p++) {
          paramsObj[params[p]] = scope.form[params[p]].$modelValue
        }

        var funcVal = formField.skipLogic['func'].execute(paramsObj)
        scope.form[scope.field.name].$setViewValue(funcVal)
        scope.form[scope.field.name].$render()
      })
    })
  }

  console.log('Checks Chips')

  // add watchers for any logic checks (show/hide)
  if (formField.skipLogic.checks.length > 0) {
    for (var i = 0; i < formField.skipLogic.checks.length; i++) {
      console.log(formField.skipLogic.checks[i])
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

        console.log('Watching: ' + check.variable + ' - ' + value + ' to match --- ' + check.value)
        console.log(operators[check.operand](value, check.value))

        if (operators[check.operand](value, check.value)) {
          scope.field.show = true
        } else {
          scope.field.show = false
        }
      }, true)
    }
  }
}
