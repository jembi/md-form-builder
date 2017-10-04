'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbSelect.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true

      if (scope.field.skipLogic) {
        skipLogic.init(scope, elem, attrs, scope.field)
      }

      scope.clearSearchTerm = function () {
        scope.searchTerm = ''
      }
      // The md-select directive eats keydown events for some quick select
      // logic. Since we have a search input here, we don't need that logic.
      elem.find('input').on('keydown', function (ev) {
        ev.stopPropagation()
      })

      if (scope.field.loadOptionsFunc) {
        scope.loadOptions = function () {
          // material design expects a promise
          return new Promise(function (resolve, reject) {
            // our function should be a promise
            scope.field.loadOptionsFunc().then(function (result) {
              scope.field.options = result
              resolve()
            }).catch(function (err) {
              console.log(err) // should be handled properly, not just printed out
              reject(err)
            })
          })
        }
      }
    }
  }
}
