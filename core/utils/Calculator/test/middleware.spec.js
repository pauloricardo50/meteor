// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import MiddlewareManager from '../../MiddlewareManager';
import { borrowerExtractorMiddleware } from '../middleware';

describe('Calculator middleware', () => {
  describe('borrowerExtractorMiddleware', () => {
    class Calc {
      constructor() {
        const middlewareManager = new MiddlewareManager(this);
        middlewareManager.applyToAllMethods(borrowerExtractorMiddleware);
      }

      parameters(params) {
        return params;
      }

      parameters2 = params => params;
    }

    it('extracts borrower', () => {
      const calc = new Calc();

      expect(calc.parameters({ loan: { borrowers: 1 } })).to.deep.equal({
        loan: { borrowers: 1 },
        borrowers: [1],
      });
    });

    it('does not overwrite existing borrowers', () => {
      const calc = new Calc();

      expect(
        calc.parameters({ loan: { borrowers: 1 }, borrowers: 2 }),
      ).to.deep.equal({
        loan: { borrowers: 1 },
        borrowers: [2],
      });
    });

    it('does not work for arrow function', () => {
      const calc = new Calc();

      expect(calc.parameters2({ loan: { borrowers: 1 } })).to.deep.equal({
        loan: { borrowers: 1 },
      });
    });
  });
});
