'use strict'

module.exports = function () {
  var init = function (scope, elem, attrs, formField) {
    // add watchers for any logical functions which need to be executed based on a form variable
    if (formField.skipLogic.func && formField.skipLogic.func.watchingVars) {
      formField.skipLogic.func.watchingVars.forEach(function (watchingVar, key) {
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

          if (typeof formField.skipLogic.func.execute === 'function') {
            var funcVal = formField.skipLogic.func.execute(paramsObj)
            scope.form[scope.field.name].$setViewValue(funcVal)
            scope.form[scope.field.name].$setUntouched()
            scope.form[scope.field.name].$setPristine()
            scope.form[scope.field.name].$render()
          }
        })
      })
    }

    // add watchers for any logic checks (show/hide)
    if (formField.skipLogic.checks.length > 0) {
      for (var i = 0; i < formField.skipLogic.checks.length; i++) {
        var check = formField.skipLogic.checks[i]
        scope.$watch(check.variable, function (value, oldValue) {
          skipLogicOperandCheck(scope, value, check)
        }, true)
      }
    }
  }

  var operators = {
    '=': function (a, b) { return a === b },
    '!=': function (a, b) { return a !== b },
    '<': function (a, b) { return a < b },
    '<=': function (a, b) { return a <= b },
    '>': function (a, b) { return a > b },
    '>=': function (a, b) { return a >= b },

    'in': function (a, b) {
      if (b.indexOf(a) >= 0) {
        return true
      }
      return false
    },
    '!in': function (a, b) {
      if (b.indexOf(a) === -1) {
        return true
      }
      return false
    }
  }

  var skipLogicOperandCheck = function (scope, value, check) {
    switch (check.action) {
      case 'checkPhoneNumber':
        if (operators[check.operand](value, check.value)) {
          scope.field.settings.checkPhoneNumber = true
        } else {
          scope.field.settings.checkPhoneNumber = false
        }
        break
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
  }

  return {
    init: init,

    operators: operators,
    skipLogicOperandCheck: skipLogicOperandCheck
  }
}
