/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import {
  RESIDENCE_TYPE,
  PROPERTY_CATEGORY,
} from 'core/api/properties/propertyConstants';
import generator from '../../../factories/index';
import { proPropertyLoans } from '../../queries';
import { SOLVENCY_TYPE } from '../../loanConstants';

describe('proPropertyLoans', () => {
  beforeEach(() => {
    resetDatabase();
  });

  describe('solvency', () => {
    const solvency = {
      min: {
        propertyValue: 600000,
        borrowRatio: 0.8,
        organisationName: 'a',
      },
      max: {
        propertyValue: 400000,
        borrowRatio: 0.8,
        organisationName: 'b',
      },
    };

    it('sets solvent to UNDETERMINED on a new loan', () => {
      generator({
        loans: {
          user: { referredByUser: { _id: 'pro1' } },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
          },
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        },
      });

      const [{ properties }] = proPropertyLoans
        .clone({ userId: 'pro1', propertyId: 'propertyId' })
        .fetch();

      expect(properties[0].solvent).to.equal('UNDETERMINED');
    });

    it('sets solvent to PICK_RESIDENCE_TYPE on a new loan if not chosen', () => {
      generator({
        loans: {
          user: { referredByUser: { _id: 'pro1' } },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
          },
          maxPropertyValue: {
            type: SOLVENCY_TYPE.SIMPLE,
            canton: 'GE',
            date: new Date(),
            main: solvency,
            second: solvency,
          },
          residenceType: null,
          shareSolvency: true,
        },
      });

      const [{ properties }] = proPropertyLoans
        .clone({ userId: 'pro1', propertyId: 'propertyId' })
        .fetch();

      expect(properties[0].solvent).to.equal('PICK_RESIDENCE_TYPE');
    });

    it('does not share solvency by default', () => {
      generator({
        loans: {
          user: { referredByUser: { _id: 'pro1' } },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
          },
          maxPropertyValue: {
            type: SOLVENCY_TYPE.SIMPLE,
            canton: 'GE',
            date: new Date(),
            main: solvency,
            second: solvency,
          },
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
        },
      });

      const [{ properties }] = proPropertyLoans
        .clone({ userId: 'pro1', propertyId: 'propertyId' })
        .fetch();

      expect(properties[0].solvent).to.equal('NOT_SHARED');
    });

    it('shares solvency if set', () => {
      generator({
        loans: {
          user: { referredByUser: { _id: 'pro1' } },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
          },
          maxPropertyValue: {
            type: SOLVENCY_TYPE.SIMPLE,
            canton: 'GE',
            date: new Date(),
            main: solvency,
            second: solvency,
          },
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
          shareSolvency: true,
        },
      });

      const [{ properties }] = proPropertyLoans
        .clone({ userId: 'pro1', propertyId: 'propertyId' })
        .fetch();

      expect(properties[0].solvent).to.equal('INSOLVENT');
    });

    it('shares solvency if set', () => {
      generator({
        loans: {
          user: { referredByUser: { _id: 'pro1' } },
          properties: {
            _id: 'propertyId',
            category: PROPERTY_CATEGORY.PRO,
            value: 400000,
          },
          maxPropertyValue: {
            type: SOLVENCY_TYPE.SIMPLE,
            canton: 'GE',
            date: new Date(),
            main: solvency,
            second: solvency,
          },
          residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
          shareSolvency: true,
        },
      });

      const [{ properties }] = proPropertyLoans
        .clone({ userId: 'pro1', propertyId: 'propertyId' })
        .fetch();

      expect(properties[0].solvent).to.equal('SOLVENT');
    });
  });
});
