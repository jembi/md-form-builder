'use strict'

var first = require('../../forms/first.json')
var second = require('../../forms/second.json')

module.exports = ($scope, FormBuilderService) => {
  $scope.$watch('state.FormBuilder', function (newValue) {
    if (newValue) {
      $scope.aceEditor = JSON.stringify(newValue, null, 2)
    }
  }, true)

  // $scope.aceLoaded = function(_editor) {
  //   // Options
  //   // _editor.setReadOnly(true)
  // }

  // $scope.aceChanged = function(e) {
  //   $scope.state.FormBuilder = JSON.parse($scope.aceEditor)
  // }

  var calculateBMI = function (params) {
    if (params.weight && params.height) {
      var bmi = params.weight / (params.height / 100 * params.height / 100)
      return bmi.toFixed(2)
    }
  }

  FormBuilderService.addFunctionToField(second, 'bmi', 'skipLogic.func.execute', calculateBMI)

  $scope.formName = 'FormBuilderTestForm'
  $scope.state = {}
  $scope.state.FormBuilder = {
    name: 'FormBuilderForm',
    displayType: 'tabs', // options are 'tabs' or 'null'
    class: 'customFormClass',
    styles: 'display: block;',
    globals: {
      viewModeOnly: false, // disable editing
      hideNotifications: true, // hide the notification message from displaying at the top of the form
      showDraftSubmitButton: true, // show a checkbox for the user to submit a draft
      showReviewButton: false
    },
    buttons: {
      submit: 'Search' // The text on the submit button
    },
    sections: [first, second], // add all of your sections here, see below
    submit: {
      submissionType: 'valuesOnly', // options are 'raw', the default or 'valuesOnly'
      execute: () => {}, // the function that will be executed on submission
      params: [] // any extra parameters to pass to your submit function
    },
    [$scope.formName]: {} // form values will be stored here,
  }
}
