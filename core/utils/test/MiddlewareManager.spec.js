// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import MiddlewareManager from '../MiddlewareManager';

const addingMiddleware = calc => next => (...args) => next(args[0] + 1, args[1]);
const subtractingMiddleware = calc => next => (...args) => next(args[0] - 1, args[1]);

describe('MiddlewareManager', () => {
  describe('with Classes', () => {
    class Calculator {
      multiply(a, b) {
        return a * b;
      }
    }

    let calc;
    let middlewareManager;

    beforeEach(() => {
      calc = new Calculator();
      middlewareManager = new MiddlewareManager(calc);
    });

    it('behaves normally without wrapping', () => {
      expect(calc.multiply(2, 3)).to.equal(6);
    });

    it('intercepts a class method and modifies it', () => {
      middlewareManager.use('multiply', [addingMiddleware]);
      expect(calc.multiply(2, 3)).to.equal(9);
    });

    it('allows non-arrays to be passed as a single param', () => {
      middlewareManager.use('multiply', addingMiddleware);
      expect(calc.multiply(2, 3)).to.equal(9);
    });

    it('works with multiple middlewares', () => {
      middlewareManager.use('multiply', [
        addingMiddleware,
        subtractingMiddleware,
      ]);
      expect(calc.multiply(2, 3)).to.equal(6);
    });

    it('works with a middleware object', () => {
      const calcMiddleware = {
        multiply: addingMiddleware,
      };
      middlewareManager = new MiddlewareManager(calc, calcMiddleware);
      expect(calc.multiply(2, 3)).to.equal(9);
    });

    it('works with a middleware object in array', () => {
      const calcMiddleware = {
        multiply: addingMiddleware,
      };
      middlewareManager = new MiddlewareManager(calc, [calcMiddleware]);
      expect(calc.multiply(2, 3)).to.equal(9);
    });

    it('works with multiple middleware object', () => {
      const calcMiddleware1 = {
        multiply: addingMiddleware,
      };
      const calcMiddleware2 = {
        multiply: subtractingMiddleware,
      };
      middlewareManager = new MiddlewareManager(calc, [
        calcMiddleware1,
        calcMiddleware2,
      ]);
      expect(calc.multiply(2, 3)).to.equal(6);
    });
  });
});
