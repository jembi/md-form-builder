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

  var moduleName = 'md-form-builder'
  require('angular-hotkeys')
  global.moment = require('moment') // required my mdPickers
  var mod = angular.module(moduleName, [ require('angular-material'), require('mdPickers'), 'cfp.hotkeys' ])

  require('./mdFormBuilder.css')
  require('../node_modules/mdPickers/dist/mdPickers.min.css')

  require('./mdFormBuilder.html')
  require('./controls/mdfbAccordian.html')
  require('./controls/mdfbCheckboxes.html')
  require('./controls/mdfbChips.html')
  require('./controls/mdfbDatePicker.html')
  require('./controls/mdfbDisplay.html')
  require('./controls/mdfbEmail.html')
  require('./controls/mdfbInput.html')
  require('./controls/mdfbInputNumber.html')
  require('./controls/mdfbMatrix.html')
  require('./controls/mdfbPassword.html')
  require('./controls/mdfbRadio.html')
  require('./controls/mdfbSelect.html')
  require('./controls/mdfbSelectSearch.html')
  require('./controls/mdfbWebcam.html')
  require('./controls/mdfbWebcamDialogPopup.html')

  mod.directive('mdfbAccordian', require('./controls/mdfbAccordian'))
  mod.directive('mdfbCheckboxes', require('./controls/mdfbCheckboxes'))
  mod.directive('mdfbChips', require('./controls/mdfbChips'))
  mod.directive('mdfbDatepicker', require('./controls/mdfbDatePicker'))
  mod.directive('mdfbDisplay', require('./controls/mdfbDisplay'))
  mod.directive('mdfbEmail', require('./controls/mdfbEmail'))
  mod.directive('mdfbInput', require('./controls/mdfbInput'))
  mod.directive('mdfbInputNumber', require('./controls/mdfbInputNumber'))
  mod.directive('mdfbMatrix', require('./controls/mdfbMatrix'))
  mod.directive('mdfbPassword', require('./controls/mdfbPassword'))
  mod.directive('mdfbRadio', require('./controls/mdfbRadio'))
  mod.directive('mdfbSelect', require('./controls/mdfbSelect'))
  mod.directive('mdfbSelectSearch', require('./controls/mdfbSelectSearch'))
  mod.directive('mdfbWebcam', require('./controls/mdfbWebcam'))
  mod.directive('mdFormBuilder', require('./mdFormBuilder'))

  return moduleName
}))
