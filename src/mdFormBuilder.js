/* global angular */

'use strict'

module.exports = function ($window, $timeout, $anchorScroll, $location, hotkeys) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdFormBuilder.html',
    scope: {
      form: '='
    },
    link: function (scope, elem, attrs) {
      scope.$watch('form', function (formConfig) {
        if (formConfig) {
          scope.FormBuilder = formConfig
          scope.formMsg = {
            display: false,
            msg: null,
            status: null
          }

          if (formConfig.globals.viewModeOnly) {
            hotkeys.del('shift+s')
          }

          $timeout(function () {
            scope[scope.FormBuilder.name].$setPristine()
            scope.tabs.selectedIndex = 0
            scope.$apply()
          }, 500)
        }
      })
    },
    controller: FormBuilderCtrl,
    controllerAs: 'FormBuilder',
    bindToController: false
  }
}

function FormBuilderCtrl ($scope, $window, $timeout, $anchorScroll, $location, hotkeys) {
  /* Hotkeys */
  $scope.tabs = {}
  $scope.tabs.selectedIndex = 0
  $scope.submitButtonText = 'Submit'
  $scope.$watch('selectedIndex', function (current, old) {})
  $scope.$watch('FormBuilder.buttons.submit', function (current, old) {
    if (current !== old) {
      $scope.submitButtonText = $scope.FormBuilder.buttons.submit || 'Submit'
    }
  })

  hotkeys.add({
    combo: 'shift+left',
    description: 'Go to the previous section',
    callback: function () {
      $scope.moveTabBack($scope.tabs.selectedIndex)
    }
  })

  hotkeys.add({
    combo: 'shift+right',
    description: 'Go to the next section',
    callback: function () {
      $scope.moveTabForward($scope.tabs.selectedIndex)
    }
  })

  hotkeys.add({
    combo: 'shift+s',
    description: 'Submit the form',
    callback: function () {
      $scope[$scope.FormBuilder.name].$setSubmitted()
      $scope.submitForm()
    }
  })

  hotkeys.add({
    combo: 'shift+x',
    description: 'Close Notification Bar',
    callback: function () {
      $scope.formMsg.display = false
    }
  })
  /* Hotkeys */

  $scope.moveTabBack = function (selectedIndex) {
    if ($scope.tabs.selectedIndex > 0) {
      $scope.scrollToFormBuilder()
      $scope.tabs.selectedIndex--
    }
  }

  $scope.moveTabForward = function (selectedIndex) {
    if ($scope.tabs.selectedIndex < ($scope.FormBuilder.sections.length - 1)) {
      $scope.scrollToFormBuilder()
      $scope.tabs.selectedIndex++
    }
  }

  $scope.scrollToFormBuilder = function () {
    var old = $location.hash()
    $location.hash('FormBuilder')
    $anchorScroll()
    // reset to old to keep any additional routing logic from kicking in
    $location.hash(old)
  }

  $scope.setFormMessage = function (result) {
    // if no msg set - dont show form message
    if ($scope.FormBuilder.globals.hideNotifications) {
      return
    }

    // set form messsage
    $scope.formMsg.msg = result.msg
    $scope.formMsg.display = true

    if (result.isValid === null) {
      $scope.formMsg.status = 'processing'
    } else {
      if (result.isValid) {
        $scope.formMsg.status = 'success'
      } else {
        $scope.formMsg.status = 'error'
      }

      // timeout for removing messages - success/error only
      if ($scope.FormBuilder.globals.messageTimeout) {
        $timeout(function () {
          $scope.formMsg.msg = null
          $scope.formMsg.display = false
        }, $scope.FormBuilder.globals.messageTimeout)
      }
    }

    $timeout(function () {
      $scope.$apply()
    }, 50)

    $scope.scrollToFormBuilder()
  }

  function getFormFieldValues (form) {
    var formFieldsValues = {}
    for (var k in form) {
      if (form.hasOwnProperty(k)) {
        if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue')) {
          if (form[k].$modelValue !== '' && form[k].$modelValue !== undefined && form[k].$modelValue !== null) {
            formFieldsValues[k] = form[k].$modelValue
          }
        }
      }
    }

    return formFieldsValues
  }

  $scope.submitForm = function () {
    if ($scope.FormBuilder.globals.showReviewButton) {
      console.log('setPristine to remove errors - Need to find better way')
      $scope[$scope.FormBuilder.name].$setPristine()
    }

    $scope.setFormMessage({ isValid: null, msg: 'Busy processing...' })
    $scope.tabErrors = {}

    angular.forEach($scope.FormBuilder.sections, function (section) {
      $scope.tabErrors[section.key] = 0
    })

    // override required validations for saving in draft
    if ($scope[$scope.FormBuilder.name].saveAsDraft) {
      for (var k in $scope[$scope.FormBuilder.name]) {
        if ($scope[$scope.FormBuilder.name].hasOwnProperty(k)) {
          if (typeof $scope[$scope.FormBuilder.name][k] === 'object' && $scope[$scope.FormBuilder.name][k].hasOwnProperty('$modelValue')) {
            $scope[$scope.FormBuilder.name][k].$setTouched()
            $scope[$scope.FormBuilder.name][k].$setDirty()
          }
        }
      }
    } else {
      // touch all elements to force validations
      Object.keys($scope[$scope.FormBuilder.name].$error).forEach(function (prop) {
        angular.forEach($scope[$scope.FormBuilder.name].$error[prop], function (field) {
          field.$setTouched()
        })
      })
    }

    // submitted - invalid - prevent form from being submitted
    if ($scope[$scope.FormBuilder.name].$submitted && $scope[$scope.FormBuilder.name].$invalid) {
      var errorFields = []
      // trigger tab notifications
      Object.keys($scope[$scope.FormBuilder.name].$error).forEach(function (prop) {
        angular.forEach($scope[$scope.FormBuilder.name].$error[prop], function (field) {
          var errorFieldName = field.$name

          angular.forEach($scope.FormBuilder.sections, function (section) {
            var sectionKey = section.key

            angular.forEach(section.rows, function (row) {
              angular.forEach(row.fields, function (rowField) {
                if (rowField.name === errorFieldName && errorFields.indexOf(rowField.name) === -1) {
                  errorFields.push(rowField.name)
                  $scope.tabErrors[sectionKey]++
                }
              })
            })
          })
        })
      })

      var result = {
        isValid: false,
        msg: 'Some fields are not complete. Please correct them and try again. '
      }

      $scope.setFormMessage(result)
    } else {
      var promise
      if ($scope.FormBuilder.submit.submissionType && $scope.FormBuilder.submit.submissionType === 'valuesOnly') {
        var values = getFormFieldValues($scope[$scope.FormBuilder.name])
        promise = $scope.FormBuilder.submit.execute(values)
      } else {
        promise = $scope.FormBuilder.submit.execute($scope[$scope.FormBuilder.name])
      }
      promise.then(function (result) {
        $scope.setFormMessage(result)
      }).catch(function (err) {
        console.log(err)
        $scope.setFormMessage(err)
      })
    }
  }

  $scope.removeRow = function (rowToRemove) {
    $scope.FormBuilder.sections.forEach(function (section) {
      section.rows = section.rows.filter(function (row) {
        return row !== rowToRemove
      })
    })
  }
}
