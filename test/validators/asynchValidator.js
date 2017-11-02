'use strict'

const tap = require('tap')
const sinon = require('sinon')

const asynchValidator = require('../../src/validators/asynchValidator')()

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
        $viewValue: ''
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

tap.test('.asynchValidator()', { autoend: true }, (t) => {
  t.test('should set the field`s $error[error_key] to "false" when all validations are successful', (t) => {
    let scope = initScope()

    scope.form.IDNumber.$setValidity = (key, value) => {
      scope.form.IDNumber.$error = {}
      scope.form.IDNumber.$error[key] = !value
    }

    const verifyIDUniqueness = (value) => Promise.resolve()

    let formField = {
      name: 'IDNumber',
      validation: [
        {
          key: 'unique_id',
          message: 'ID must be unique',
          execute: verifyIDUniqueness
        }
      ]
    }

    let globals = {}

    asynchValidator.init(scope, formField, globals)

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

    let formField = {
      name: 'IDNumber',
      validation: [
        {
          key: 'unique_id',
          message: 'ID must be unique',
          execute: verifyIDUniqueness
        }
      ]
    }

    let globals = {}

    asynchValidator.init(scope, formField, globals)

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

    let formField = {
      name: 'IDNumber',
      validation: [
        {
          key: 'unique_id',
          message: 'ID must be unique',
          execute: verifyIDUniqueness
        }
      ]
    }

    let globals = {}

    asynchValidator.init(scope, formField, globals)

    t.true(globals.validating)

    setTimeout(() => {
      t.false(globals.validating)
      t.end()
    }, 0)
  })
})
