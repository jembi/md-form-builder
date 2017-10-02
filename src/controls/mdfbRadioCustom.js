/* global angular */

'use strict'

module.exports = function ($timeout, $mdDialog) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbRadioCustom.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (scope.field.skipLogic) {
        initSkipLogicRadioCustom(scope, elem, attrs, $timeout, scope.field)
      }

      scope.showList = {}
      scope.toggleList = function (key) {
        scope.showList[key] = !scope.showList[key]
      }

      scope.selectedDocuments = {}
      angular.forEach(scope.field.data.lists, function (list, key) {
        scope.selectedDocuments[key] = []
        angular.forEach(list.items, function (item) {
          if (item.selected) {
            scope.selectedDocuments[key].push(item.code)
          }
        })
      })

      scope.editSelectedDocuments = function (key, code) {
        var index = scope.selectedDocuments[key].indexOf(code)
        if (index > -1) {
          scope.selectedDocuments[key].splice(index, 1)
        } else {
          scope.selectedDocuments[key].push(code)
        }
      }

      scope.showPrompt = function (rowIndex, type, value) {
        function DialogController ($scope, $mdDialog, data) {
          $scope.data = data
          $scope.hide = function () {
            $mdDialog.hide()
          }

          $scope.cancel = function () {
            $mdDialog.cancel()
          }

          $scope.submitForm = function () {
            if ($scope.commentForm.$valid) {
              $mdDialog.hide($scope.data.value)
            }
          }
        }

        $mdDialog.show({
          clickOutsideToClose: false,
          fullscreen: true,
          controllerAs: 'ctrl',
          templateUrl: 'app/views/findingsRecommendationModal.html',
          controller: DialogController,
          locals: { data: { type: type, value: value } }
        })
        .then(function (text) {
          scope.field.data[type] = text
        }, function () {
          // closed, do nothing
        })
      }
    }
  }
}

var initSkipLogicRadioCustom = function (scope, elem, attrs, $timeout, formField) {
  // add watchers for any logical functions which need to be executed based on a form variable
  if (formField.skipLogic.func) {
    angular.forEach(formField.skipLogic.func.watchingVars, function (watchingVar, key) {
      var varToWatch = 'form.' + watchingVar + '.$viewValue'
      scope.$watch(varToWatch, function (value, oldValue) {
        if (value === oldValue) {
          //  custom check to not reset when value = 3 - keep next level value
          if (value === 3) {
            return
          }
        }

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
