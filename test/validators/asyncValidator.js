'use strict'

const tap = require('tap')
const sinon = require('sinon')

const asyncValidator = require('../../src/validators/asyncValidator')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

const initScope = () => {
  return {
    form: {
      IDNumber: {
        $viewValue: '',
        $setTouched: () => {}
      }
    },
    field: {
      name: 'IDNumber'
    },
    $watch: (varToWatch, callBack) => {
      callBack('1711184064187', '')
    },
    $apply: () => { }
  }
}

const initFormField = (asyncFunction) => {
  return {
    name: 'IDNumber',
    validation: [
      {
        key: 'unique_id',
        message: 'ID must be unique',
        execute: asyncFunction
      }
    ]
  }
}

tap.test('.asyncValidator()', { autoend: true }, (t) => {
  t.test('should set the field`s $error[error_key] to "false" when all validations are successful', (t) => {
    let scope = initScope()

    scope.form.IDNumber.$setValidity = (key, value) => {
      scope.form.IDNumber.$error = {}
      scope.form.IDNumber.$error[key] = !value
    }

    const verifyIDUniqueness = (value) => Promise.resolve()

    let formField = initFormField(verifyIDUniqueness)

    let globals = {}

    asyncValidator.init(scope, formField, globals)

    setTimeout(() => {
      t.false(scope.form.IDNumber.$error['unique_id'])
      t.end()
    }, 0)
  })

  t.test('should set the field`s $error[error_key] to "true" when a validation fails', (t) => {
    let scope = initScope()

    scope.form.IDNumber.$setValidity = (key, value) => {
      scope.form.IDNumber.$error = {}
      scope.form.IDNumber.$error[key] = !value
    }

    const verifyIDUniqueness = (value) => Promise.reject(new Error('boom'))

    let formField = initFormField(verifyIDUniqueness)

    let globals = {}

    asyncValidator.init(scope, formField, globals)

    setTimeout(() => {
      t.true(scope.form.IDNumber.$error['unique_id'])
      t.end()
    }, 0)
  })

  t.test('should set globals.validating = true while validating, and false afterward', (t) => {
    let scope = initScope()

    scope.form.IDNumber.$setValidity = (key, value) => {
      scope.form.IDNumber.$error = {}
      scope.form.IDNumber.$error[key] = !value
    }

    const verifyIDUniqueness = (value) => Promise.resolve()

    let formField = initFormField(verifyIDUniqueness)

    let globals = {}

    asyncValidator.init(scope, formField, globals)

    t.true(globals.validating)

    setTimeout(() => {
      t.false(globals.validating)
      t.end()
    }, 0)
  })

  t.test('should not call async validation function(s) when the field is not valid', (t) => {
    let scope = initScope()

    scope.form.IDNumber.$error = { required: true }

    scope.form.IDNumber.$setValidity = (key, value) => {
      scope.form.IDNumber.$error[key] = !value
    }

    const verifyIDUniqueness = (value) => Promise.resolve()

    let formField = initFormField(verifyIDUniqueness)

    let globals = {}

    asyncValidator.init(scope, formField, globals)

    setTimeout(() => {
      t.false(scope.form.IDNumber.$error['unique_id'])
      t.end()
    }, 0)
  })
})
