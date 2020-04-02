/* eslint-env mocha */
import { expect } from 'chai';

import { PROPERTY_DOCUMENTS } from '../../../api/files/fileConstants';
import { PROPERTY_CATEGORY } from '../../../api/properties/propertyConstants';
import {
  getChecklistMissingInformations,
  getChecklistValidInformationsRatio,
} from '../helpers';

describe('LoanChecklist helpers', () => {
  describe('getChecklistValidInformationsRatio', () => {
    it('returns 0 for an empty loan', () => {
      const result = getChecklistValidInformationsRatio({ loan: {} });
      expect(result).to.deep.equal({ valid: 0, required: 0 });
    });

    it('returns just the borrower elements if there is one', () => {
      const result = getChecklistValidInformationsRatio({
        loan: { borrowers: [{}] },
      });
      expect(result).to.deep.equal({ valid: 0, required: 22 });
    });

    it('returns just the property elements', () => {
      const property = { _id: 'yo', category: PROPERTY_CATEGORY.USER };
      const result = getChecklistValidInformationsRatio({
        loan: { structure: { property }, properties: [property] },
      });
      expect(result).to.deep.equal({ valid: 0, required: 14 });
    });

    it('returns the property elements even if there is no structure', () => {
      const property = { _id: 'yo', category: PROPERTY_CATEGORY.USER };
      const result = getChecklistValidInformationsRatio({
        loan: { properties: [property] },
      });
      expect(result).to.deep.equal({ valid: 0, required: 14 });
    });

    it('does not return property elements if it is a PRO property', () => {
      const property = { _id: 'yo', category: PROPERTY_CATEGORY.PRO };
      const result = getChecklistValidInformationsRatio({
        loan: { properties: [property] },
      });
      expect(result).to.deep.equal({ valid: 0, required: 0 });
    });

    it('does not return property elements if it is a promotion loan', () => {
      const property = { _id: 'yo', category: PROPERTY_CATEGORY.USER };
      const result = getChecklistValidInformationsRatio({
        loan: { properties: [property], hasPromotion: true },
      });
      expect(result).to.deep.equal({ valid: 0, required: 0 });
    });
  });

  describe('getChecklistMissingInformations', () => {
    it('returns no fields or documents if the loan is empty', () => {
      const result = getChecklistMissingInformations(
        { loan: {} },
        args => args,
      );
      expect(result.fields.property).to.deep.equal(undefined);
      expect(result.fields.borrowers).to.deep.equal([]);
      expect(result.documents.property).to.deep.equal(undefined);
      expect(result.documents.borrowers).to.deep.equal([]);
    });

    it('returns fields and documents for borrowers ', () => {
      const result = getChecklistMissingInformations(
        { loan: { borrowers: [{}, { firstName: 'joe' }] } },
        args => args,
      );

      expect(result.fields.property).to.deep.equal(undefined);
      expect(result.fields.borrowers[0].labels.length).to.equal(22);
      expect(result.fields.borrowers[1].labels.length).to.equal(21);
    });

    it('returns fields and documents for a property ', () => {
      const result = getChecklistMissingInformations(
        {
          loan: {
            properties: [
              {
                _id: 'propertyId',
                category: PROPERTY_CATEGORY.USER,
                additionalDocuments: [
                  { id: PROPERTY_DOCUMENTS.PROPERTY_PLANS },
                  { id: 'joe', label: 'Hello' },
                ],
              },
            ],
          },
        },
        args => args,
      );

      expect(result.fields.property.labels.length).to.deep.equal(14);
      expect(result.documents.property.labels.length).to.deep.equal(2);
    });
  });
});
