'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($http, $compile) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbFileInput.html',
    scope: {
      field: '=',
      form: '=',
      globals: '='
    },
    link: function (scope, elem, attrs) {
      scope.field.show = true
      scope.file = {}

      if (scope.field.skipLogic) {
        skipLogic.init(scope, elem, attrs, scope.field)
      }

      scope.$watch('field.value', function (file) {
        if (file) {
          scope.file.pdfData = 'data:application/pdf;base64,' + file
        }
      })

      scope.inputClick = function () {
        document.getElementById('filePickerLabel').click()
      }

      scope.removePDF = function () {
        scope.file.name = null
        scope.file.pdfData = null
        scope.field.value = null
        document.getElementById('filePicker').value = null
      }

      var handleFileSelect = function (evt) {
        // TODO: Handle more than PDF file inputs, and possibly multiple inputs - Enhancements to file input control
        var files = evt.target.files
        var file = files[0]
        scope.file.name = files[0].name

        if (files && file) {
          var reader = new window.FileReader()

          reader.onload = function (readerEvt) {
            var binaryString = readerEvt.target.result

            var base64EncodedPdf = window.btoa(binaryString)
            scope.file.pdfData = 'data:application/pdf;base64,' + base64EncodedPdf
            scope.field.value = base64EncodedPdf

            document.getElementById('base64input').value = base64EncodedPdf

            scope.$apply()
          }

          reader.readAsBinaryString(file)
        }
      }

      if (window.File && window.FileReader && window.FileList && window.Blob) {
        document.getElementById('filePicker').addEventListener('change', handleFileSelect, false)
      } else {
        console.error('The File APIs are not fully supported in this browser.')
      }
    }
  }
}
