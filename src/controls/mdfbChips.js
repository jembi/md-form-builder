/* global angular */

'use strict'

var skipLogic = require('../utils/skipLogic')()
var asyncValidator = require('../validators/asyncValidator')()

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

      if (scope.field.validation) {
        asyncValidator.init(scope, scope.field, scope.globals)
      }

      scope.$watchGroup(['field.settings.required', 'field.show', 'form.saveAsDraft'], function (value, oldValue) {
        scope.field.settings.required = value[0]
        scope.field.show = value[1]
        scope.form.saveAsDraft = value[2]
      })

      var varToWatch = 'form.' + scope.field.name + '.$viewValue'
      scope.$watch(varToWatch, function (fieldValue, oldValue) {
        if (fieldValue) {
          // default to valid field
          scope.form[scope.field.name].$setValidity('chipsRequired', true)

          // set required validity
          if (scope.field.settings.required) {
            if (scope.field.show && !scope.form.saveAsDraft) {
              if (fieldValue && fieldValue.length === 0) {
                scope.form[scope.field.name].$setValidity('chipsRequired', false)
              }
            }
          }

          if (scope.field.transformFunc) {
            var promises = []
            for (var i = 0; i < fieldValue.length; i++) {
              if (!fieldValue[i].text) {
                var code = angular.copy(fieldValue[i].code)
                promises.push(getSetOptionResult(scope.field.name, i, code))
              }
            }
            Promise.all(promises).then(function () {
              var fieldIsValid = (fieldValue.length > 0) ? fieldValue.some(function (item) { return item.valid }) : true
              scope.form[scope.field.name].$setValidity('chipsInvalid', fieldIsValid)
            }).catch(function () {
              scope.form[scope.field.name].$setValidity('chipsInvalid', false)
              scope.form[scope.field.name].$touched = true
            })
          }
        }
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
          return err
        })

        return promise
      }

      scope.transformFunc = function (chip) {
        return { code: chip }
      }
    }
  }
}
