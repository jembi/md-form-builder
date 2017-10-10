'use strict'

const tap = require('tap')
const sinon = require('sinon')

const skipLogic = require('../../src/utils/skipLogic')()
const operators = skipLogic.operators
const skipLogicOperandCheck = skipLogic.skipLogicOperandCheck
const skipLogicGroupCheck = skipLogic.skipLogicGroupCheck

const sandbox = sinon.sandbox.create()
sandbox.stub(console, 'error').callsFake((msg) => {})
sandbox.stub(console, 'log').callsFake((msg) => {})
tap.tearDown(() => {
  sandbox.restore()
})

tap.test('.skipLogic()', { autoend: true }, (t) => {
  t.test('operators[=]: should run "=" operations', (t) => {
    const stringEqualTrue = operators['=']('String 12345', 'String 12345')
    const stringEqualFalse = operators['=']('String 12345', '12345 String')
    t.ok(stringEqualTrue)
    t.notOk(stringEqualFalse)

    const intEqualTrue = operators['='](12345, 12345)
    const intEqualFalse = operators['='](12345, 123456789)
    t.ok(intEqualTrue)
    t.notOk(intEqualFalse)

    const boolEqualTrue = operators['='](true, true)
    const boolEqualFalse = operators['='](true, false)
    t.ok(boolEqualTrue)
    t.notOk(boolEqualFalse)

    t.end()
  })

  t.test('operators[!=]: should run "!=" operations', (t) => {
    const stringNotEqualTrue = operators['!=']('String 12345', '12345 String')
    const stringNotEqualFalse = operators['!=']('String 12345', 'String 12345')
    t.ok(stringNotEqualTrue)
    t.notOk(stringNotEqualFalse)

    const intNotEqualTrue = operators['!='](12345, 123456789)
    const intNotEqualFalse = operators['!='](12345, 12345)
    t.ok(intNotEqualTrue)
    t.notOk(intNotEqualFalse)

    const boolNotEqualTrue = operators['!='](true, false)
    const boolNotEqualFalse = operators['!='](true, true)
    t.ok(boolNotEqualTrue)
    t.notOk(boolNotEqualFalse)

    t.end()
  })

  t.test('operators[<]: should run "<" operations', (t) => {
    const stringLessThanTrue = operators['<']('12345', '123456789')
    const stringLessThanFalse = operators['<']('123456789', '12345')
    t.ok(stringLessThanTrue)
    t.notOk(stringLessThanFalse)

    const intLessThanTrue = operators['<'](12345, 123456789)
    const intLessThanFalse = operators['<'](123456789, 12345)
    t.ok(intLessThanTrue)
    t.notOk(intLessThanFalse)

    t.end()
  })

  t.test('operators[<=]: should run "<=" operations', (t) => {
    const stringLessThanEqualTrue = operators['<=']('12345', '123456789')
    const stringLessThanEqualTrue2 = operators['<=']('12345', '12345')
    const stringLessThanEqualFalse = operators['<=']('123456789', '12345')
    t.ok(stringLessThanEqualTrue)
    t.ok(stringLessThanEqualTrue2)
    t.notOk(stringLessThanEqualFalse)

    const intLessThanEqualTrue = operators['<='](12345, 123456789)
    const intLessThanEqualTrue2 = operators['<='](12345, 12345)
    const intLessThanEqualFalse = operators['<='](123456789, 12345)
    t.ok(intLessThanEqualTrue)
    t.ok(intLessThanEqualTrue2)
    t.notOk(intLessThanEqualFalse)

    t.end()
  })

  t.test('operators[>]: should run ">" operations', (t) => {
    const stringMoreThanTrue = operators['>']('123456789', '12345')
    const stringMoreThanFalse = operators['>']('12345', '123456789')
    t.ok(stringMoreThanTrue)
    t.notOk(stringMoreThanFalse)

    const intMoreThanTrue = operators['>'](123456789, 12345)
    const intMoreThanFalse = operators['>'](12345, 123456789)
    t.ok(intMoreThanTrue)
    t.notOk(intMoreThanFalse)

    t.end()
  })

  t.test('operators[>=]: should run ">=" operations', (t) => {
    const stringMoreThanEqualTrue = operators['>=']('123456789', '12345')
    const stringMoreThanEqualTrue2 = operators['>=']('12345', '12345')
    const stringMoreThanEqualFalse = operators['>=']('12345', '123456789')
    t.ok(stringMoreThanEqualTrue)
    t.ok(stringMoreThanEqualTrue2)
    t.notOk(stringMoreThanEqualFalse)

    const intMoreThanEqualTrue = operators['>='](123456789, 12345)
    const intMoreThanEqualTrue2 = operators['>='](12345, 12345)
    const intMoreThanEqualFalse = operators['>='](12345, 123456789)
    t.ok(intMoreThanEqualTrue)
    t.ok(intMoreThanEqualTrue2)
    t.notOk(intMoreThanEqualFalse)

    t.end()
  })

  t.test('operators[in]: should run "in" operations', (t) => {
    const stringInArrayTrue = operators['in']('inArray', ['test', 'testing', 'inArray', 'Another Test'])
    const stringInArrayFalse = operators['in']('notInArray', ['test', 'testing', 'inArray', 'Another Test'])
    const stringInArrayFalse2 = operators['in']('Another', ['test', 'testing', 'inArray', 'Another Test'])
    t.ok(stringInArrayTrue)
    t.notOk(stringInArrayFalse)
    t.notOk(stringInArrayFalse2)

    const stringInValueTrue = operators['in']('inArray', 'Some string inArray test')
    const stringInValueFalse = operators['in']('notInArray', 'Some string inArray test')
    t.ok(stringInValueTrue)
    t.notOk(stringInValueFalse)

    const intInArrayTrue = operators['in'](78, [12, 34, 56, 78, 90])
    const intInArrayFalse = operators['in'](87, [12, 34, 56, 78, 90])
    const intInArrayFalse2 = operators['in'](1, [12, 34, 56, 78, 90])
    t.ok(intInArrayTrue)
    t.notOk(intInArrayFalse)
    t.notOk(intInArrayFalse2)

    t.end()
  })

  t.test('operators[!in]: should run "!in" operations', (t) => {
    const stringInArrayTrue = operators['!in']('notInArray', ['test', 'testing', 'inArray', 'Another Test'])
    const stringInArrayFalse = operators['!in']('inArray', ['test', 'testing', 'inArray', 'Another Test'])
    t.ok(stringInArrayTrue)
    t.notOk(stringInArrayFalse)

    const intInArrayTrue = operators['!in'](87, [12, 34, 56, 78, 90])
    const intInArrayFalse = operators['!in'](78, [12, 34, 56, 78, 90])
    t.ok(intInArrayTrue)
    t.notOk(intInArrayFalse)

    t.end()
  })

  t.test('skipLogicOperandCheck(): should set the field setting for required', (t) => {
    const scope = {
      field: {
        settings: {
          disabled: null
        }
      }
    }
    const check = {
      operand: '=',
      value: 'ShouldMatch',
      action: 'disabled'
    }

    skipLogicOperandCheck(scope, 'ShouldMatch', check)
    t.ok(scope.field.settings.disabled)

    skipLogicOperandCheck(scope, 'ShouldNotMatch', check)
    t.notOk(scope.field.settings.disabled)

    t.end()
  })

  t.test('skipLogicOperandCheck(): should set the field setting for disabled', (t) => {
    const scope = {
      field: {
        settings: {
          required: null
        }
      }
    }
    const check = {
      operand: '=',
      value: 'ShouldMatch',
      action: 'required'
    }

    skipLogicOperandCheck(scope, 'ShouldMatch', check)
    t.ok(scope.field.settings.required)

    skipLogicOperandCheck(scope, 'ShouldNotMatch', check)
    t.notOk(scope.field.settings.required)

    t.end()
  })

  t.test('skipLogicOperandCheck(): should set the field setting for disabled', (t) => {
    const scope = {
      field: {
        show: null
      }
    }
    const check = {
      operand: '=',
      value: 'ShouldMatch',
      action: 'showhide'
    }

    skipLogicOperandCheck(scope, 'ShouldMatch', check)
    t.ok(scope.field.show)

    skipLogicOperandCheck(scope, 'ShouldNotMatch', check)
    t.notOk(scope.field.show)

    t.end()
  })

  t.test('skipLogicOperandCheck(): should set the field setting for disabled', (t) => {
    const scope = {
      field: {
        settings: {
          checkPhoneNumber: null
        }
      }
    }
    const check = {
      operand: '=',
      value: 'ShouldMatch',
      action: 'checkPhoneNumber'
    }

    skipLogicOperandCheck(scope, 'ShouldMatch', check)
    t.ok(scope.field.settings.checkPhoneNumber)

    skipLogicOperandCheck(scope, 'ShouldNotMatch', check)
    t.notOk(scope.field.settings.checkPhoneNumber)

    t.end()
  })

  t.test('skipLogicOperandCheck(): should set the field setting for disabled', (t) => {
    const scope = {
      field: {
        settings: {
          checkIdNumber: null
        }
      }
    }
    const check = {
      operand: '=',
      value: 'ShouldMatch',
      action: 'checkIdNumber'
    }

    skipLogicOperandCheck(scope, 'ShouldMatch', check)
    t.ok(scope.field.settings.checkIdNumber)

    skipLogicOperandCheck(scope, 'ShouldNotMatch', check)
    t.notOk(scope.field.settings.checkIdNumber)

    t.end()
  })

  t.test('skipLogicGroupCheck(): should match one depth group appropriately with "and" logicGate', (t) => {
    const scope = {
      field: {
        settings: {
          showhide: null
        }
      },
      form: []
    }

    const check = {
      logicGate: 'and',
      action: 'showhide',
      group: [{
        operand: '=',
        value: 'yes',
        variable: 'form.var1.$modelValue'
      }, {
        operand: '=',
        value: 'yes',
        variable: 'form.var2.$modelValue'
      }, {
        operand: '=',
        value: 'yes',
        variable: 'form.var3.$modelValue'
      }]
    }

    scope.form['var1'] = { $modelValue: 'yes' }
    scope.form['var2'] = { $modelValue: 'no' }
    scope.form['var3'] = { $modelValue: 'yes' }

    skipLogicGroupCheck(scope, check)
    t.notOk(scope.field.show)

    scope.form.var2.$modelValue = 'yes'
    skipLogicGroupCheck(scope, check)
    t.ok(scope.field.show)

    t.end()
  })

  t.test('skipLogicGroupCheck(): should match one depth group appropriately with "or" logicGate', (t) => {
    const scope = {
      field: {
        settings: {
          showhide: null
        }
      },
      form: []
    }

    const check = {
      logicGate: 'or',
      action: 'showhide',
      group: [{
        operand: '=',
        value: 'yes',
        variable: 'form.var1.$modelValue'
      }, {
        operand: '=',
        value: 'yes',
        variable: 'form.var2.$modelValue'
      }, {
        operand: '=',
        value: 'yes',
        variable: 'form.var3.$modelValue'
      }]
    }

    scope.form['var1'] = { $modelValue: 'yes' }
    scope.form['var2'] = { $modelValue: 'no' }
    scope.form['var3'] = { $modelValue: 'yes' }

    skipLogicGroupCheck(scope, check)
    t.ok(scope.field.show)

    scope.form.var1.$modelValue = 'no'
    scope.form.var3.$modelValue = 'no'

    skipLogicGroupCheck(scope, check)
    t.notOk(scope.field.show)

    t.end()
  })

  t.test('operators[contains]: should return true when value is in arrays', (t) => {
    t.true(operators['contains'](['match1', 'match2'], 'match1'))
    t.end()
  })

  t.test('operators[contains]: should return false when value is NOT in arrays', (t) => {
    t.false(operators['contains'](['match1', 'match2'], 'invalid'))
    t.end()
  })

  t.test('operators[!contains]: should return false when value is in arrays', (t) => {
    t.false(operators['!contains'](['match1', 'match2'], 'match1'))
    t.end()
  })

  t.test('operators[!contains]: should return true when value is NOT in arrays', (t) => {
    t.true(operators['!contains'](['match1', 'match2'], 'invalid'))
    t.end()
  })
})
