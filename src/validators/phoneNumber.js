'use strict'

module.exports = function ($compile) {

  return {
    restrict: "A",
    require: "ngModel",
    scope: {
      checkPhoneNumber: '=checkPhoneNumber'
    },
    link: function(scope, element, attributes, ngModel) {

      scope.$watch('checkPhoneNumber', function(newValue, oldValue) {

        // do not validate the ID number
        if (!newValue){
          // always return true as we are not validating anymore
          ngModel.$validators.checkPhoneNumber = function(){
            return true
          }
          ngModel.$validate();
        }else{
          // add validator for Phone number
          ngModel.$validators.checkPhoneNumber = function(modelValue) {

            console.log(modelValue)

            var numberRegex = new RegExp(/^\+?\d{10}$/);

            var isValid = numberRegex.test(modelValue)
            console.log(isValid)

            return isValid
          }
          ngModel.$validate();
        }

      }, true);

    }
  };
}