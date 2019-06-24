/* eslint-env mocha */
import { expect } from 'chai';
import Intl from 'core/utils/server/intl';

import { getChecklistMissingInformations } from '../../../helpers';

describe('LoanChecklist', () => {
  context('getChecklistMissingInformations', () => {
    describe('returns the right missing informations', () => {
      it('with one borrower without name', () => {
        const { fields, documents } = getChecklistMissingInformations({
          loan: {
            borrowers: [{ _id: 'paul', additionalDocuments: [{ id: 'doc' }] }],
            structure: {},
          },
          intl: { formatMessage: Intl.formatMessage.bind(Intl) },
        });
        expect(fields.property).to.equal(undefined);
        expect(documents.property).to.equal(undefined);
        expect(fields.borrowers.length).to.equal(1);
        expect(documents.borrowers.length).to.equal(1);
        expect(fields.borrowers[0].title).to.equal('Emprunteur 1');
        expect(fields.borrowers[0].labels.length).to.equal(18);
        expect(documents.borrowers[0].title).to.equal('Emprunteur 1');
        expect(documents.borrowers[0].labels.length).to.equal(1);
      });
      it('with two borrowers with name', () => {
        const { fields, documents } = getChecklistMissingInformations({
          loan: {
            borrowers: [
              {
                _id: 'paul',
                name: 'Paul',
                additionalDocuments: [{ id: 'doc' }],
              },
              { _id: 'michel', name: 'Michel' },
            ],
            structure: {},
          },
          intl: { formatMessage: Intl.formatMessage.bind(Intl) },
        });
        expect(fields.property).to.equal(undefined);
        expect(documents.property).to.equal(undefined);
        expect(fields.borrowers.length).to.equal(2);
        expect(documents.borrowers.length).to.equal(2);
        expect(fields.borrowers[0].title).to.equal('Paul');
        expect(fields.borrowers[0].labels.length).to.equal(18);
        expect(documents.borrowers[0].title).to.equal('Paul');
        expect(documents.borrowers[0].labels.length).to.equal(1);
        expect(fields.borrowers[1].title).to.equal('Michel');
        expect(fields.borrowers[1].labels.length).to.equal(18);
        expect(documents.borrowers[1].title).to.equal('Michel');
        expect(documents.borrowers[1].labels.length).to.equal(0);
      });

      it('with two borrowers with name and property', () => {
        const { fields, documents } = getChecklistMissingInformations({
          loan: {
            borrowers: [
              {
                _id: 'paul',
                name: 'Paul',
                additionalDocuments: [{ id: 'doc' }],
              },
              { _id: 'michel', name: 'Michel' },
            ],
            structure: { propertyId: 'property' },
            properties: [
              { _id: 'property', additionalDocuments: [{ id: 'doc' }] },
            ],
          },
          intl: { formatMessage: Intl.formatMessage.bind(Intl) },
        });
        expect(fields.property).to.not.equal(undefined);
        expect(fields.property.title).to.equal('Bien immobilier');
        expect(fields.property.labels.length).to.equal(16);
        expect(documents.property).to.not.equal(undefined);
        expect(documents.property.labels.length).to.equal(1);
        expect(fields.borrowers.length).to.equal(2);
        expect(documents.borrowers.length).to.equal(2);
        expect(fields.borrowers[0].title).to.equal('Paul');
        expect(fields.borrowers[0].labels.length).to.equal(18);
        expect(documents.borrowers[0].title).to.equal('Paul');
        expect(documents.borrowers[0].labels.length).to.equal(1);
        expect(fields.borrowers[1].title).to.equal('Michel');
        expect(fields.borrowers[1].labels.length).to.equal(18);
        expect(documents.borrowers[1].title).to.equal('Michel');
        expect(documents.borrowers[1].labels.length).to.equal(0);
      });
    });
  });
});
