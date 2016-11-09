/* global angular */

'use strict'

module.exports = function ($compile, $mdDialog) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbMatrixCustom.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      console.log(scope.field.config.rows)
      for (var i = 0; i < scope.field.config.rows.length; i++) {
        if (scope.field.config.rows[i].skipLogic) {
          initSkipLogicMatrixCustom(scope, elem, attrs, scope.field.config.rows[i])
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
          templateUrl: 'views/findingsRecommendationModal.html',
          controller: DialogController,
          locals: { data: { type: type, value: value } }
        })
          .then(function (text) {
            scope.field.config.rows[rowIndex].data[type] = text
          }, function () {
            console.log('Did not consent')
          })
      }
    }
  }
}

var initSkipLogicMatrixCustom = function (scope, elem, attrs, formField) {
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

  console.log('Matrix Custom Radio')

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
