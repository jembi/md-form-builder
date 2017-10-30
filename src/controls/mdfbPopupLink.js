'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($compile, $mdDialog, $injector) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbPopupLink.html',
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

      scope.showDialog = function (ev) {
        $mdDialog.show({
          contentElement: '#popup_' + scope.field.name,
          targetEvent: ev,
          clickOutsideToClose: true
        })
      }

      scope.cancel = function () {
        $mdDialog.cancel()
      }
    }
  }
}
