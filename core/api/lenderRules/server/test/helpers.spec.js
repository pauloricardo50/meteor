// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { getAllRules } from '../../helpers';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';

describe('lenderRules helpers', () => {
  describe('getAllRules', () => {
    it('gets all the rules from a single filter', () => {
      const loan = { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE };
      const lenderRules = {
        filters: [
          {
            filter: {
              and: [
                {
                  '===': [
                    { var: 'residenceType' },
                    RESIDENCE_TYPE.MAIN_RESIDENCE,
                  ],
                },
              ],
            },
            hello: 'dude',
          },
        ],
      };

      expect(getAllRules(loan, lenderRules)).to.deep.equal({
        hello: 'dude',
      });
    });

    it('merges rules in the order of the filters', () => {
      const loan = {
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        hasPromotion: true,
      };
      const lenderRules = {
        filters: [
          {
            filter: {
              and: [
                {
                  '===': [
                    { var: 'residenceType' },
                    RESIDENCE_TYPE.MAIN_RESIDENCE,
                  ],
                },
              ],
            },
            yo: 'dawg',
            hello: 'dude',
          },
          {
            filter: {
              and: [
                {
                  '===': [{ var: 'hasPromotion' }, true],
                },
              ],
            },
            hello: 'ma dude',
          },
        ],
      };

      expect(getAllRules(loan, lenderRules)).to.deep.equal({
        yo: 'dawg',
        hello: 'ma dude',
      });
    });

    it('skips rules that do not match', () => {
      const loan = {
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        hasPromotion: true,
      };
      const lenderRules = {
        filters: [
          {
            filter: {
              and: [
                {
                  '===': [
                    { var: 'residenceType' },
                    RESIDENCE_TYPE.SECOND_RESIDENCE,
                  ],
                },
              ],
            },
            yo: 'dawg',
            hello: 'dude',
          },
          {
            filter: {
              and: [
                {
                  '===': [{ var: 'hasPromotion' }, true],
                },
              ],
            },
            hello: 'ma dude',
          },
        ],
      };

      expect(getAllRules(loan, lenderRules)).to.deep.equal({
        hello: 'ma dude',
      });
    });

    it('works with nested variables', () => {
      const loan = { a: { b: { c: true } } };
      const lenderRules = {
        filters: [
          {
            filter: { and: [{ '===': [{ var: 'a.b.c' }, true] }] },
            hello: 'dude',
          },
        ],
      };

      expect(getAllRules(loan, lenderRules)).to.deep.equal({
        hello: 'dude',
      });
    });
  });
});
