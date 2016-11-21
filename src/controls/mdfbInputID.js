'use strict'

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbInputID.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (scope.field.skipLogic) {
        initSkipLogicInputID(scope, elem, attrs, scope.field)
      }
    }
  }
}

var initSkipLogicInputID = function (scope, elem, attrs, formField) {
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
        scope.form[scope.field.name].$setUntouched()
        scope.form[scope.field.name].$setPristine()
        scope.form[scope.field.name].$render()
      })
    })
  }

  // add watchers for any logic checks (show/hide)
  if (formField.skipLogic.checks.length > 0) {
    for (var i = 0; i < formField.skipLogic.checks.length; i++) {
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

        switch (check.action) {
          case 'checkIdNumber':
            if (operators[check.operand](value, check.value)) {
              scope.field.settings.checkIdNumber = true
            } else {
              scope.field.settings.checkIdNumber = false
            }
            break
          case 'disabled':
            if (operators[check.operand](value, check.value)) {
              scope.field.settings.disabled = true
            } else {
              scope.field.settings.disabled = false
            }
            break
          case 'required':
            if (operators[check.operand](value, check.value)) {
              scope.field.settings.required = true
            } else {
              scope.field.settings.required = false
            }
            break
          case 'showhide':
          default:
            if (operators[check.operand](value, check.value)) {
              scope.field.show = true
            } else {
              scope.field.show = false
            }
        }
      }, true)
    }
  }
}