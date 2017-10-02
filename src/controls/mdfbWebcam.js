/* global angular */

'use strict'

var skipLogic = require('../utils/skipLogic')()

module.exports = function ($rootScope, $timeout, $compile, $mdMedia, $mdDialog) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'mdfbWebcam.html',
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

      scope.showAdvanced = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'mdfbWebcamDialogPopup.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: true
        })
          .then(function (answer) {
            scope.photo = answer
            scope.form[scope.field.name].$setViewValue(answer)
            scope.form[scope.field.name].$render()
          }, function () {
            console.log('NOT Saving Photo')
          })

        scope.$watch(function () {
          return $mdMedia('xs') || $mdMedia('sm')
        }, function (wantsFullScreen) {
          scope.customFullscreen = (wantsFullScreen === true)
        })
      }

      function DialogController (scope, $mdDialog) {
        scope.hide = function () {
          $mdDialog.hide()
        }
        scope.cancel = function () {
          $mdDialog.cancel()
        }
        scope.savePhoto = function (savePhoto) {
          $timeout(function () {
            $rootScope.$broadcast('STOP_WEBCAM')
            $rootScope.$emit('STOP_WEBCAM')
            console.log('Cancel Cam')
            $rootScope.$digest()
          }, 500)

          if (savePhoto) {
            $mdDialog.hide(scope.snapshotData)
          }

          $mdDialog.hide()
        }

        var _video = null

        scope.patOpts = {x: 0, y: 0, w: 25, h: 25}

        // Setup a channel to receive a video property
        // with a reference to the video element
        // See the HTML binding in main.html
        scope.channel = {
          videoHeight: 450,
          videoWidth: 450,
          video: null
        }
        scope.showCanvasPhoto = false

        scope.webcamError = false
        scope.onError = function (err) {
          scope.$apply(
            function () {
              scope.webcamError = err
            }
          )
        }

        scope.onSuccess = function () {
          // The video element contains the captured camera data
          _video = scope.channel.video
          scope.$apply(function () {
            scope.patOpts.w = _video.width
            scope.patOpts.h = _video.height
          // scope.showDemos = true
          })
        }

        scope.onStream = function (stream) {
          // You could do something manually with the stream.
        }

        scope.makeSnapshot = function () {
          if (_video) {
            scope.showCanvasPhoto = true
            var patCanvas = document.querySelector('#snapshot')
            if (!patCanvas) return

            patCanvas.width = _video.width
            patCanvas.height = _video.height
            var ctxPat = patCanvas.getContext('2d')

            var idata = getVideoData(scope.patOpts.x, scope.patOpts.y, scope.patOpts.w, scope.patOpts.h)
            ctxPat.putImageData(idata, 0, 0)

            sendSnapshotToServer(patCanvas.toDataURL())
          }
        }

        /**
         * Redirect the browser to the URL given.
         * Used to download the image by passing a dataURL string
         */
        scope.downloadSnapshot = function downloadSnapshot (dataURL) {
          window.location.href = dataURL
        }

        var getVideoData = function getVideoData (x, y, w, h) {
          var hiddenCanvas = document.createElement('canvas')
          hiddenCanvas.width = _video.width
          hiddenCanvas.height = _video.height
          var ctx = hiddenCanvas.getContext('2d')
          ctx.drawImage(_video, 0, 0, _video.width, _video.height)
          return ctx.getImageData(x, y, w, h)
        }

        /**
         * This function could be used to send the image data
         * to a backend server that expects base64 encoded images.
         *
         * In this example, we simply store it in the scope for display.
         */
        var sendSnapshotToServer = function sendSnapshotToServer (imgBase64) {
          scope.snapshotData = imgBase64
        }
      }
    }
  }
}
