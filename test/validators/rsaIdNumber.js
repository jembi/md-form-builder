'use strict'

const tap = require('tap')
const sinon = require('sinon')

const idNumber = require('../../src/validators/rsaIdNumber')()

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

const shortId = '123'
const invalidId = '1901014800086'
const validId = '2001014800086'

tap.test('.link()', { autoend: true }, (t) => {
  t.test('rsaIdValidate(): should return false for a invalid ID length', (t) => {
    const scope = {
      $watch: () => {}
    }
    const directive = idNumber.link(scope)

    const result = directive.rsaIdValidate(shortId)

    t.notOk(result.isValid)
    t.equals(result.errorMessage, 'Identity number supplied is not a valid length or is not a number', 'should equal \'Identity number supplied is not a valid length or is not a number\'')

    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('rsaIdValidate(): should return false for a invalid ID', (t) => {
    const scope = {
      $watch: () => {}
    }
    const directive = idNumber.link(scope)

    const result = directive.rsaIdValidate(invalidId)

    t.notOk(result.isValid)
    t.equals(result.errorMessage, 'Identity Number supplied check digit validation failed', 'should equal \'Identity Number supplied check digit validation failed\'')

    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('rsaIdValidate(): should return true for a valid ID', (t) => {
    const scope = {
      $watch: () => {}
    }
    const directive = idNumber.link(scope)

    const result = directive.rsaIdValidate(validId)

    t.ok(result.isValid)

    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('setValidity(): should return true when no validation is needed', (t) => {
    const scope = {
      $watch: () => {}
    }
    const ngModelMock = {
      $validators: {},
      $validate: () => {}
    }

    const directive = idNumber.link(scope, null, null, ngModelMock)

    // dont check validity, so field is valid
    directive.setValidity(false)

    t.ok(ngModelMock.$validators.checkRsaIdNumber())

    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('setValidity(): should return false when id number is invalid', (t) => {
    const scope = {
      $watch: () => {}
    }
    const ngModelMock = {
      $validators: {},
      $validate: () => {}
    }

    const directive = idNumber.link(scope, null, null, ngModelMock)

    directive.setValidity(true)

    t.notOk(ngModelMock.$validators.checkRsaIdNumber(invalidId))

    t.end()
  })
})

tap.test('.link()', { autoend: true }, (t) => {
  t.test('setValidity(): should return true when id number is valid', (t) => {
    const scope = {
      $watch: () => {}
    }
    const ngModelMock = {
      $validators: {},
      $validate: () => {}
    }

    const directive = idNumber.link(scope, null, null, ngModelMock)

    // no value, so field is valid
    directive.setValidity(true)

    t.ok(ngModelMock.$validators.checkRsaIdNumber(validId))

    t.end()
  })
})
