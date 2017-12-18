[![Build Status](https://travis-ci.org/jembi/md-form-builder.svg?branch=master)](https://travis-ci.org/jembi/md-form-builder)

# AngularJS - Material Design Form Builder

This form builder works with AngularJS and Material Design to build dynamic forms and comes with various features.

## Installing
```
npm install md-form-builder
```

To include this module into your AngularJS application you have the following options

### Include as a script tag in your html
```html
<script src="/node_modules/md-form-builder/dist/bundle.js"></script>
```

### Include using CommonJS (node.js) style require or browserify
```js
require('md-form-builder')
```

The add the dependency to angular module
```js
angular.module('<your_module>', [ 'md-form-builder' ])
```

## Use as follows

```html
<md-form-builder form="state.FormBuilder"></md-form-builder>
```

In a controller or directive we then setup the state for the form.

```js
$scope.formName = 'FormBuilderTestForm'
$scope.state = {};
$scope.state.FormBuilder = {
  name: 'FormBuilderForm',
  displayType: 'tabs', // options are 'tabs' or 'null'
  class: "customFormClass",
  styles: "display: block;",
  globals: {
    viewModeOnly: false, // disable editing
    hideNotifications: // hide the notification message from displaying at the top of the form
    showDraftSubmitButton: true, // show a checkbox for the user to submit a draft
    showReviewButton: false
  },
  buttons: {
    submit: 'Search' // The text on the submit button
  },
  sections: [], // add all of your sections here, see below
  submit: {
    submissionType: 'valuesOnly' // options are 'raw', the default or 'valuesOnly'
    // 'raw' mean that the raw form will be passed to the submission function. To get
    // the form values you can iterate over it as follows:
    //
    // var formFieldsValues = {}
    // for (var k in form) {
    //   if (form.hasOwnProperty(k)) {
    //     if (typeof form[k] === 'object' && form[k].hasOwnProperty('$modelValue')) {
    //       formFieldsValues[k] = form[k].$modelValue
    //     }
    //   }
    // }
    //
    // 'valuesOnly' does this processing for you so you get back an object with field
    // values: e.g. { field1: 'value1', field2: 'value2' }
    execute: submitFormBuilderForm, // the function that will be executed on submission
    // the first parameter to this function will be the form values in the format
    // determined above.
    //
    // This function MUST return a promise which resovles or reject with an object
    // in the following format { isValid: true | false, msg: '<a message to the user>' }
    // isValid determines if the form submission was successful or not
    params: [] // any extra parameters to pass to your submit function
  },
  [$scope.formName]: {} // form values will be stored here,
}
```

Each section contains rows and each row has fields. See the example of a sections array below for some of the available options.

```js
[
  {
    "key": "tab1",
    "name": "Tab 1",
    "displayName": "Tab 1",
    "flex": "100",
    "class": "customSectionClass",
    "styles": "display: block;",
    "rows": [{
      "name": "Row 1",
      "title": "Below are some of the types of inputs that are available in mdFormBuilder",
      "layout": "row",
      "class": "customRowClass",
      "styles": "display: block;",
      "fields": [{
        "type": "input",
        "flex": "25",
        "name": "input",
        "title": "Input - Text",
        "class": "customFieldClass",
        "styles": "display: block;",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "inputNumber",
        "flex": "25",
        "name": "inputNumber",
        "title": "Input - Integer",
        "settings": {
          "valueType": "valueDecimal",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "email",
        "flex": "25",
        "name": "email",
        "title": "Input - Email",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "time",
        "flex": "25",
        "name": "time",
        "title": "Input - Time",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "password",
        "flex": "25",
        "name": "password",
        "title": "Input - Password",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "display",
        "flex": "25",
        "name": "display",
        "title": "display",
        "settings": {
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": "Some display text"
      }, {
        "type": "accordian",
        "flex": "25",
        "name": "accordian",
        "title": "Display - accordian",
        "settings": {
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "tabs": [{ "name": "Tab 1", "content": "content for tab 1" }, { "name": "Tab 2", "content": "content for tab 2" }]
      }, {
        "type": "date",
        "flex": "25",
        "name": "date",
        "title": "Input - Datepicker",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "webcam",
        "flex": "25",
        "name": "password",
        "title": "Input - Webcam",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "radio",
        "flex": "25",
        "name": "radio",
        "title": "input - Radio",
        "settings": {
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "options": [{ "key": "yes", "value": "Yes" }, { "key": "no", "value": "No" }, { "key": "maybe", "value": "Maybe" }],
        "value": "Some display text"
      }, {
        "type": "checkboxes",
        "flex": "25",
        "name": "checkboxes",
        "title": "Display - Checkboxes",
        "settings": {
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "options": [{ "key": "yes", "value": "Yes" }, { "key": "no", "value": "No" }],
        "value": null
      }, {
        "type": "select",
        "flex": "25",
        "name": "select",
        "title": "Input - Select",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "options": [{ "key": "1", "value": "Option 1" }, { "key": "2", "value": "Option 2" }, { "key": "3", "value": "Option 3" }],
        "value": null
      }, {
        "type": "selectSearch",
        "flex": "25",
        "name": "selectSearch",
        "title": "Input - SelectSearch",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "options": [{ "key": "1", "value": "Option 1" }, { "key": "2", "value": "Option 2" }, { "key": "3", "value": "Option 3" }],
        "value": null
      }, {
        "type": "chips",
        "flex": "50",
        "name": "chips",
        "title": "Input - Chips",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "value": null
      }, {
        "type": "matrix",
        "flex": "50",
        "name": "matrix",
        "title": "Input - matrix",
        "settings": {
          "valueType": "valueString",
          "disabled": false,
          "required": true
        },
        "skipLogic": {
          "func": {},
          "checks": []
        },
        "config": {
          "required": false,
          "rows": [
            {
              "id": "matrixQuestion1",
              "value": "Question 1"
            },
            {
              "id": "matrixQuestion2",
              "value": "Question 2"
            },
            {
              "id": "matrixQuestion3",
              "value": "Question 3"
            }
          ],
          "columns": [
            {
              "value": "No"
            },
            {
              "value": "Yes"
            },
            {
              "value": "Maybe"
            }
          ]
        },
        "value": null
      }, {
        "type": "popupLink",
        "flex": "30",
        "name": "popupLink",
        "title": "Terms and Conditions",
        "value": "<b>Terms and Conditions</b><p>Text ...</p>"
      }]
    }]
  },
  {
    "key": "tab2",
    "name": "Tab 2",
    "displayName": "Tab 2",
    "flex": "100",
    "rows": [{
      "name": "Row 2",
      "title": "This section shows some skip logic and functional input",
      "layout": "row",
      "fields": [{
        "type": "inputNumber",
        "flex": "30",
        "name": "weight",
        "title": "What is your weight? (kg)",
        "settings": {
          "valueType": "valueDecimal",
          "required": true
        },
        "value": null
      }, {
        "type": "inputNumber",
        "flex": "30",
        "name": "height",
        "title": "What is your height? (cm)",
        "settings": {
          "valueType": "valueInteger",
          "required": true
        },
        "value": null
      }, {
        "type": "inputNumber",
        "flex": "30",
        "name": "bmi",
        "title": "BMI",
        "settings": {
          "valueType": "valueDecimal",
          "disabled": true
        },
        "skipLogic": {
          "func": {
            "execute": "calculateBMI",
            "params": ["weight", "height"],
            "watchingVars": ["weight", "height"]
          },
          "checks": [{
            "variable": "form.bmi.$modelValue",
            "operand": ">",
            "value": 0
          }]
        },
        "value": null
      }]
    }]
  }
]
```

### Skip Logic

FormBuilder allows you to add skip logic and functional support to field to enhance its capabilities. Below is a skip logic setting that checks for a field called "bmi" and shows the field if the value is bigger than 0
```
"skipLogic": {
  "checks": [{
    "variable": "form.bmi.$modelValue", // variable to check, can be a FormBuilder global variable as well (e.g. global.gender)
    "operand": ">", // operand to perform ( "=", "!=", "<", "<=", ">", ">=", "in", "!in", "contains", "!contains" )
    // 'in' check if the variable is in the value whereas 'contains' checks the inverse. I.e. if the value is in the variable.
    "value": 0 // value that needs to checked for.
    "action": "showhide" // action to perform on the field ("disabled", "required", "showhide")
  }]
}
```

To evaluate grouped checks such as to deal with logic gates ("or", "and"), use something like;
```
"skipLogic": {
  "checks": [{
    "logicGate": "and", // logic evaluation creterial to check group items against ("or", "and")
    "action": "showhide", // action to perform on the field ("disabled", "required", "showhide")
    "group": [{
      "variable": "form.age.$modelValue", // variable to check, can be a FormBuilder global variable as well (e.g. global.gender)
      "operand": ">=", // operand to perform ( "=", "!=", "<", "<=", ">", ">=", "in", "!in", "contains", "!contains" )
      "value": 15 // value that needs to checked for.
    },{
      "variable": "form.gender.$modelValue", // variable to check, can be a FormBuilder global variable as well (e.g. global.gender)
      "operand": "=", // operand to perform ( "=", "!=", "<", "<=", ">", ">=", "in", "!in", "contains", "!contains" )
      "value": "M" // value that needs to checked for.
    }]
  }]
}
```

Below is a skip logic function checks that will execute a function called "calculateBMI" when both the "weight" and "height" fields have values. for a field called "bmi" and shows the field if the value is bigger than 0
```
"skipLogic": {
  "func": {
    "execute": "placeholderForCalculateBMI", // function to execute. !NB this must be a function attached to this property to execute successfully. The function gets executed within FormBuilder and supplies one argument to your function which will hold all the parameters and their values supplied in the "params" property. E.g ["weight", "height"]
    "params": ["weight", "height"], // params to send to the function
    "watchingVars": ["weight", "height"] // watch these variables and execute function with supplied params fields
  }
}
```

The calculateBMI function looks like the below function. This function needs to be assigned to the 'execute' property to run successfully
```
var calculateBMI = function (params) {
  if (params.weight && params.height) {
    var bmi = params.weight / (params.height / 100 * params.height / 100)
    return bmi.toFixed(2)
  }
}
```

### Asynchronous validation

FormBuilder allows you to add asynchronous validation to fields. It is possible to have more than one custom asynchronous validation for each field. The validation is configured by adding a "validation" property to a field as illustrated in the example below. The validation field contains an array of objects containing the following properties:
 - key: a validation error code
 - message: an error message to display below the field
 - execute: a custom function to perform asynchronous validation. The function should have a single argument representing the value entered in the field and return a Promise which should resolve when there is no error, or reject in case of error.

The submit button is disabled and its label changes to 'validating ...' while the validation is in progress.

```js
{ 
  "type": "inputID",
  "flex": "80", // the flex width of the input
  "name": "IDNumber", // A name which will be used to reference the value of this field in the form
  "title": "ID Number", // A label that will be displayed above the field
  "validation": [
    {
      "key": "unique_id", // a custom validation error code
      "message" : "The id must be unique", // an error message to display below the field
      "execute" : "placeHolderForVerifyIDUniqueness" // a custom function to perform asynchronous validation
    }
  ]
}
```

## Input field reference (work in progress)

### inputNumber

```js
{
  "type": "inputNumber",
  "flex": "30", // the flex width of the input
  "name": "height", // A name which will be used to reference the value of this field in the form
  "title": "What is your height? (cm)", // A label that will be displayed above the field
  "settings": {
    "valueType": "valueInteger",
    "required": true // (optional) whether this field is required or not
    "min": "1", // (optional) The minimum number this control accepts
    "max": "250", // (optional) The maximum number this control accepts
    "step": "0.01", // (optional) The step size in whcih the value be increased by the spinner, this also determines the allowable decimal points
    "disableSpinner": true // (optional) If the number spinner button should be hidden or not
  },
  "value": null // the initial value of this field
}
```

### time

```js
{
  "type": "time",
  "flex": "30", // the flex width of the input
  "name": "startTime", // A name which will be used to reference the value of this field in the form
  "title": "When did the procedure start? (HH:MM)", // A label that will be displayed above the field
  "settings": {
    "valueType": "valueString",
    "required": true // (optional) whether this field is required or not
  },
  "value": null // the initial value of this field
}
```

### popupLink

```js
{
  "type": "popupLink",
  "flex": "30", // the flex width of the input
  "name": "popupLink", // A name which will be used to reference the value of this field in the form
  "title": "Terms and Conditions", // The title of the popup dialog
  "value": "<b>Terms and Conditions</b><p>Text ...</p>" // the content of the popup dialog
}
```

### fileInput (Currently only PDFs are supported)

```js
{
  "type": "fileInput",
  "flex": "100", // the flex width of the input
  "name": "linkedProviderInformation", // A name which will be used to reference the value of this field in the form
  "title": "Linked Provider Information", // The title of the popup dialog
  "settings": {
    "filePreview": true // // (optional) whether to display the preview of the file or not
  },
  "value": null
}
```
