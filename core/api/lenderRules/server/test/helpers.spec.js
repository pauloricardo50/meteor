/* eslint-env mocha */
import { expect } from 'chai';
import omit from 'lodash/omit';

import { getMatchingRules } from '../../helpers';
import { RESIDENCE_TYPE } from '../../../properties/propertyConstants';

const checkRules = (result, expected) => {
  // Don't check the names variable
  expect(omit(result, 'names')).to.deep.equal(expected);
};

describe('lenderRules helpers', () => {
  describe('getMatchingRules', () => {
    it('gets all the rules from a single filter', () => {
      const variables = { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE };
      const lenderRules = [
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
      ];

      checkRules(getMatchingRules(lenderRules, variables), { hello: 'dude' });
    });

    it('merges rules in the order of the filters', () => {
      const variables = {
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        hasPromotion: true,
      };
      const lenderRules = [
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
      ];

      checkRules(getMatchingRules(lenderRules, variables), {
        yo: 'dawg',
        hello: 'ma dude',
      });
    });

    it('skips rules that do not match', () => {
      const variables = {
        residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        hasPromotion: true,
      };
      const lenderRules = [
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
      ];

      checkRules(getMatchingRules(lenderRules, variables), {
        hello: 'ma dude',
      });
    });

    it('works with nested variables', () => {
      const variables = { a: { b: { c: true } } };
      const lenderRules = [
        {
          filter: { and: [{ '===': [{ var: 'a.b.c' }, true] }] },
          hello: 'dude',
        },
      ];

      checkRules(getMatchingRules(lenderRules, variables), {
        hello: 'dude',
      });
    });

    it('matches one in an array of values', () => {
      const variables = { residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE };
      const lenderRules = [
        {
          filter: {
            and: [
              {
                in: [
                  { var: 'residenceType' },
                  [
                    RESIDENCE_TYPE.MAIN_RESIDENCE,
                    RESIDENCE_TYPE.SECOND_RESIDENCE,
                  ],
                ],
              },
            ],
          },
          hello: 'dude',
        },
      ];

      checkRules(getMatchingRules(lenderRules, variables), {
        hello: 'dude',
      });
    });
  });
});
