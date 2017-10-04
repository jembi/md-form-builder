/* global angular */

'use strict'

var skipLogic = require('../utils/skipLogic')()

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
        skipLogic.init(scope, elem, attrs, scope.field)
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
