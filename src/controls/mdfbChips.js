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
          var promises = []
          for (var i = 0; i < value.length; i++) {
            if (!value[i].text) {
              var code = angular.copy(value[i].code)
              promises.push(getSetOptionResult(scope.field.name, i, code))
            }
          }
          Promise.all(promises).then(function () {
            var fieldIsValid = (value.length > 0) ? value.some(function (item) { return item.valid }) : true
            scope.form[scope.field.name].$setValidity('code', fieldIsValid)
          }).catch(function () {
            scope.form[scope.field.name].$setValidity('code', false)
            scope.form[scope.field.name].$touched = true
          })
        }, true)

        var getSetOptionResult = function (field, index, code) {
          var promise = scope.field.transformFunc(code)
          promise.then(function (result) {
            var fieldValue = scope.form[field].$viewValue
            fieldValue[index] = result
            scope.form[field].$setViewValue(fieldValue)
            scope.form[field].$setUntouched()
            scope.form[field].$setPristine()
          }).catch(function (err) {
            console.log(err)
          })

          return promise
        }

        scope.transformFunc = function (chip) {
          return { code: chip }
        }
      }
    }
  }
}
