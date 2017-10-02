'use strict'

const moment = require('moment')
const angular = require('angular')
const ngRoute = require('angular-route')
const ngCookies = require('angular-cookies')
const ngResource = require('angular-resource')
const ngMessages = require('angular-messages')
const ngSanitize = require('angular-sanitize')
const ngMaterial = require('angular-material')
const formBuilder = require('md-form-builder')

require('../../node_modules/ace-builds/src-min-noconflict/ace.js')
require('../../node_modules/angular-ui-ace/src/ui-ace.js')

const dependencies = [ ngRoute, formBuilder, ngMaterial, ngCookies, ngResource, ngMessages, ngSanitize, 'ui.ace' ]
const app = angular.module('demoLandApp', dependencies)

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/landing.html',
      controller: 'LandingCtrl'
    })

    .otherwise({
      redirectTo: '/'
    })
})

app.config(function ($mdDateLocaleProvider) {
  $mdDateLocaleProvider.formatDate = function (date) {
    return date ? moment(date).format('YYYY-MM-DD') : date
  }
})

app.config(function ($locationProvider) {
  $locationProvider.hashPrefix('') // Remove ! from url
})

function bootstrapApplication () {
  require('./controllers')
  require('./services')

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['demoLandApp'])
  })
}
bootstrapApplication()
