//      
/* eslint-env mocha */
import { expect } from 'chai';

import makeArgumentMapper from '../argumentMapperMiddleware';
import MiddlewareManager from '../MiddlewareManager';

describe('argumentMapperMiddleware', () => {
  class Calculator {
    multiply({ a, b }) {
      return a * b;
    }

    divide(a, b) {
      return a / b;
    }
  }

  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  it('works for functions that take objects', () => {
    expect(calc.multiply({ a: 2, b: 3 })).to.equal(6);

    const middleware = makeArgumentMapper({
      multiply: ({ c, d }) => ({ a: c, b: d }),
    });
    const middlewareManager = new MiddlewareManager(calc, middleware);

    expect(calc.multiply({ c: 2, d: 3 })).to.equal(6);
  });

  it('works for functions that take multiple arguments', () => {
    expect(calc.divide(4, 4)).to.equal(1);

    const middleware = makeArgumentMapper({
      divide: ({ a, b }) => [a, b],
    });
    const middlewareManager = new MiddlewareManager(calc, middleware);

    expect(calc.divide({ a: 4, b: 4 })).to.equal(1);
  });

  it('does not alter methods without mappings', () => {
    const middleware = makeArgumentMapper({
      multiply: ({ c, d }) => ({ a: c, b: d }),
    });
    const middlewareManager = new MiddlewareManager(calc, middleware);

    expect(calc.multiply({ c: 2, d: 3 })).to.equal(6);
    expect(calc.divide(4, 4)).to.equal(1);
  });
});
