/* global define */

(function (root, factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular'], factory)
  } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
    // CommonJS support (for us webpack/browserify/ComponentJS folks)
    module.exports = factory(require('angular'))
  } else {
    // in the case of no module loading system
    // then don't worry about creating a global
    // variable like you would in normal UMD.
    // It's not really helpful... Just call your factory
    return factory(root.angular)
  }
}(this, function (angular) {
  'use strict'

  require('angular-animate')
  require('angular-aria')
  require('angular-hotkeys')
  require('angular-material')
  require('angular-messages')
  require('angular-notification-icons')
  require('angular-sanitize')
  require('angular-touch')
  require('moment')
  require('v-accordion')
  require('webcam/dist/webcam.min.js')

  var moduleName = 'md-form-builder'
  var mod = angular.module(moduleName, [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngMessages',
    'ngSanitize',
    'ngMaterial',
    'cfp.hotkeys',
    'angular-notification-icons',
    'vAccordion',
    'webcam'
  ])

  require('./mdFormBuilder.css')

  require('./mdFormBuilder.html')
  require('./controls/mdfbAccordian.html')
  require('./controls/mdfbCheckboxes.html')
  require('./controls/mdfbChips.html')
  require('./controls/mdfbDatePicker.html')
  require('./controls/mdfbDisplay.html')
  require('./controls/mdfbPopupLink.html')
  require('./controls/mdfbEmail.html')
  require('./controls/mdfbTime.html')
  require('./controls/mdfbInput.html')
  require('./controls/mdfbFileInput.html')
  require('./controls/mdfbInputID.html')
  require('./controls/mdfbInputPhoneNumber.html')
  require('./controls/mdfbInputNumber.html')
  require('./controls/mdfbMatrix.html')
  require('./controls/mdfbPassword.html')
  require('./controls/mdfbRadio.html')
  require('./controls/mdfbRadioCustom.html')
  require('./controls/mdfbSelect.html')
  require('./controls/mdfbSelectSearch.html')
  require('./controls/mdfbWebcam.html')
  require('./controls/mdfbWebcamDialogPopup.html')

  mod.directive('mdfbAccordian', require('./controls/mdfbAccordian'))
  mod.directive('mdfbCheckboxes', require('./controls/mdfbCheckboxes'))
  mod.directive('mdfbChips', require('./controls/mdfbChips'))
  mod.directive('mdfbDatepicker', require('./controls/mdfbDatePicker'))
  mod.directive('mdfbDisplay', require('./controls/mdfbDisplay'))
  mod.directive('mdfbPopupLink', require('./controls/mdfbPopupLink'))
  mod.directive('mdfbEmail', require('./controls/mdfbEmail'))
  mod.directive('mdfbTime', require('./controls/mdfbTime'))
  mod.directive('mdfbInput', require('./controls/mdfbInput'))
  mod.directive('mdfbFileInput', require('./controls/mdfbFileInput'))
  mod.directive('mdfbInputId', require('./controls/mdfbInputID'))
  mod.directive('mdfbInputPhoneNumber', require('./controls/mdfbInputPhoneNumber'))
  mod.directive('mdfbInputNumber', require('./controls/mdfbInputNumber'))
  mod.directive('mdfbMatrix', require('./controls/mdfbMatrix'))
  mod.directive('mdfbPassword', require('./controls/mdfbPassword'))
  mod.directive('mdfbRadio', require('./controls/mdfbRadio'))
  mod.directive('mdfbRadioCustom', require('./controls/mdfbRadioCustom'))
  mod.directive('mdfbSelect', require('./controls/mdfbSelect'))
  mod.directive('mdfbSelectSearch', require('./controls/mdfbSelectSearch'))
  mod.directive('mdfbWebcam', require('./controls/mdfbWebcam'))
  mod.directive('mdFormBuilder', require('./mdFormBuilder'))

  // validators
  mod.directive('checkRsaIdNumber', require('./validators/rsaIdNumber'))
  mod.directive('checkPhoneNumber', require('./validators/phoneNumber'))
  mod.directive('regexValidation', require('./validators/regex'))

  return moduleName
}))
