/* eslint-env mocha */
import { expect } from 'chai';

import {
  ACQUISITION_FIELDS,
  PURCHASE_TYPE,
  REFINANCING_FIELDS,
} from '../widget1Constants';
import {
  makeSelectValue,
  makeWidget1Selector,
  selectAutoValues,
  selectFields,
} from '../widget1Selectors';

describe('selectors', () => {
  describe('makeWidget1Selector', () => {
    it('should select widget1', () => {
      const myField = 'hello world';
      expect(makeWidget1Selector('myField')({ widget1: { myField } })).to.equal(
        myField,
      );
    });
  });

  describe('makeSelectValue', () => {
    it('should get the value of a field', () => {
      const myField = { value: 200 };
      expect(makeSelectValue('myField')({ widget1: { myField } })).to.equal(
        myField.value,
      );
    });
  });

  describe('selectFields', () => {
    it('should select the right fields', () => {
      expect(
        selectFields({
          widget1: { purchaseType: PURCHASE_TYPE.ACQUISITION },
        }),
      ).to.equal(ACQUISITION_FIELDS);
      expect(
        selectFields({
          widget1: { purchaseType: PURCHASE_TYPE.REFINANCING },
        }),
      ).to.equal(REFINANCING_FIELDS);
    });
  });

  describe('selectAutoValues', () => {
    it('selects all auto values based on purchase type', () => {
      const autoValues = {
        salary: { auto: 1 },
        fortune: { auto: 2 },
        property: { auto: 3 },
      };
      expect(
        selectAutoValues({
          widget1: { purchaseType: PURCHASE_TYPE.ACQUISITION, ...autoValues },
        }),
      ).to.deep.equal({
        salary: autoValues.salary.auto,
        fortune: autoValues.fortune.auto,
        property: autoValues.property.auto,
      });
    });

    it('selects all auto values based on purchase type', () => {
      const autoValues = {
        salary: { auto: 1 },
        fortune: { auto: 2 },
        property: { auto: 3 },
        wantedLoan: { auto: 4 },
        currentLoan: { auto: 5 },
      };
      expect(
        selectAutoValues({
          widget1: { purchaseType: PURCHASE_TYPE.REFINANCING, ...autoValues },
        }),
      ).to.deep.equal({
        salary: autoValues.salary.auto,
        property: autoValues.property.auto,
        currentLoan: autoValues.currentLoan.auto,
        wantedLoan: autoValues.wantedLoan.auto,
      });
    });

    it.skip('memoizes properly, running the same computation only once', () => {
      let autoValues = {
        salary: { auto: 1 },
        fortune: { auto: 2 },
        property: { auto: 3 },
      };
      expect(selectAutoValues.recomputations()).to.equal(0);
      expect(
        selectAutoValues({
          widget1: { purchaseType: PURCHASE_TYPE.ACQUISITION, ...autoValues },
        }),
      ).to.deep.equal({
        salary: autoValues.salary.auto,
        fortune: autoValues.fortune.auto,
        property: autoValues.property.auto,
      });
      autoValues = {
        salary: { auto: 1 },
        fortune: { auto: 2 },
        property: { auto: 3 },
      };
      expect(
        selectAutoValues({
          widget1: { purchaseType: PURCHASE_TYPE.ACQUISITION, ...autoValues },
        }),
      ).to.deep.equal({
        salary: autoValues.salary.auto,
        fortune: autoValues.fortune.auto,
        property: autoValues.property.auto,
      });
      expect(selectAutoValues.recomputations()).to.equal(1);
    });
  });
});
