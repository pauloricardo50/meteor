/* eslint-env mocha */
import { expect } from 'chai';

import { EMAIL_IDS } from '../../../../../api/email/emailConstants';
import generator from '../../../../../api/factories/server';
import { sendLoanChecklist } from '../../../../../api/loans/methodDefinitions';
import { ddpWithUserId } from '../../../../../api/methods/methodHelpers';
import intl from '../../../../../utils/intl';
import { checkEmails, resetDatabase } from '../../../../../utils/testHelpers';
import { getChecklistMissingInformations } from '../../../helpers';

const { formatMessage } = intl;

describe('LoanChecklist', function() {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  context('getChecklistMissingInformations', () => {
    describe('returns the right missing informations', () => {
      it('with one borrower without name', () => {
        const { fields, documents } = getChecklistMissingInformations(
          {
            loan: {
              borrowers: [
                { _id: 'paul', additionalDocuments: [{ id: 'doc' }] },
              ],
              structure: {},
            },
          },
          formatMessage,
        );
        expect(fields.property).to.equal(undefined);
        expect(documents.property).to.equal(undefined);
        expect(fields.borrowers.length).to.equal(1);
        expect(documents.borrowers.length).to.equal(1);
        expect(fields.borrowers[0].title).to.equal('Emprunteur 1');
        expect(fields.borrowers[0].labels.length).to.equal(22);
        expect(documents.borrowers[0].title).to.equal('Emprunteur 1');
        expect(documents.borrowers[0].labels.length).to.equal(1);
      });

      it('with two borrowers with name', () => {
        const { fields, documents } = getChecklistMissingInformations(
          {
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
          },
          formatMessage,
        );
        expect(fields.property).to.equal(undefined);
        expect(documents.property).to.equal(undefined);
        expect(fields.borrowers.length).to.equal(2);
        expect(documents.borrowers.length).to.equal(2);
        expect(fields.borrowers[0].title).to.equal('Paul');
        expect(fields.borrowers[0].labels.length).to.equal(22);
        expect(documents.borrowers[0].title).to.equal('Paul');
        expect(documents.borrowers[0].labels.length).to.equal(1);
        expect(fields.borrowers[1].title).to.equal('Michel');
        expect(fields.borrowers[1].labels.length).to.equal(22);
        expect(documents.borrowers[1].title).to.equal('Michel');
        expect(documents.borrowers[1].labels.length).to.equal(0);
      });

      it('with two borrowers with name and property', () => {
        const { fields, documents } = getChecklistMissingInformations(
          {
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
          },
          formatMessage,
        );
        expect(fields.property).to.not.equal(undefined);
        expect(fields.property.title).to.equal('Bien immobilier');
        expect(fields.property.labels.length).to.equal(15);
        expect(documents.property).to.not.equal(undefined);
        expect(documents.property.labels.length).to.equal(1);
        expect(fields.borrowers.length).to.equal(2);
        expect(documents.borrowers.length).to.equal(2);
        expect(fields.borrowers[0].title).to.equal('Paul');
        expect(fields.borrowers[0].labels.length).to.equal(22);
        expect(documents.borrowers[0].title).to.equal('Paul');
        expect(documents.borrowers[0].labels.length).to.equal(1);
        expect(fields.borrowers[1].title).to.equal('Michel');
        expect(fields.borrowers[1].labels.length).to.equal(22);
        expect(documents.borrowers[1].title).to.equal('Michel');
        expect(documents.borrowers[1].labels.length).to.equal(0);
      });
    });
  });

  it('sends an email with the right content', async () => {
    generator({
      users: {
        _id: 'adminId',
        _factory: 'admin',
        emails: [{ address: 'admin@e-potek.ch', verified: true }],
        firstName: 'Admin',
        lastName: 'User',
      },
      loans: { _id: 'loanId', borrowers: {} },
    });

    await ddpWithUserId('adminId', () =>
      sendLoanChecklist.run({
        loanId: 'loanId',
        address: 'user@e-potek.ch',
        emailParams: { customMessage: 'Hello mah dude' },
      }),
    );

    const [email] = await checkEmails(1);
    const {
      emailId,
      address,
      template: {
        template_content,
        message: { from_email, from_name, subject, to, global_merge_vars },
      },
    } = email;

    expect(emailId).to.equal(EMAIL_IDS.LOAN_CHECKLIST);
    expect(address).to.equal('user@e-potek.ch');
    expect(from_email).to.equal('admin@e-potek.ch');
    expect(from_name).to.equal('Admin User');
    expect(subject).to.equal('Invitation à compléter votre dossier');
    expect(to).to.deep.equal([
      { email: 'user@e-potek.ch', type: 'to' },
      {
        email: 'admin@e-potek.ch',
        name: 'Admin User',
        type: 'bcc',
      },
    ]);

    const css = global_merge_vars.find(({ name }) => name === 'CSS').content;
    const body = global_merge_vars.find(({ name }) => name === 'BODY').content;
    expect(css.indexOf('.check-mark')).to.not.equal(-1);
    expect(body).to.equal('Hello mah dude');

    const bodyContent = template_content.find(
      ({ name }) => name === 'body-content-1',
    ).content;

    expect(bodyContent.indexOf('Informations manquantes')).to.not.equal(-1);
    expect(bodyContent.indexOf('Emprunteur 1')).to.not.equal(-1);
  });

  it('should put multiple people in bcc and/or cc', async () => {
    generator({
      users: {
        _id: 'adminId',
        _factory: 'admin',
        emails: [{ address: 'admin@e-potek.ch', verified: true }],
        firstName: 'TestFirstName',
        lastName: 'TestLastName',
      },
      loans: { _id: 'loanId' },
    });

    await ddpWithUserId('adminId', () =>
      sendLoanChecklist.run({
        loanId: 'loanId',
        address: 'dev@e-potek.ch',
        emailParams: {
          customMessage: 'Hello mah dude',
          bccAddresses: ['bcc1@e-potek.ch'],
          ccAddresses: ['cc1@e-potek.ch'],
          mainRecipientIsBcc: true,
        },
      }),
    );

    const [
      {
        template: {
          message: { to },
        },
      },
    ] = await checkEmails(1);

    expect(to).to.deep.equal([
      {
        email: 'dev@e-potek.ch',
        type: 'bcc',
      },
      {
        email: 'cc1@e-potek.ch',
        type: 'cc',
      },
      {
        email: 'admin@e-potek.ch',
        name: 'TestFirstName TestLastName',
        type: 'bcc',
      },
      {
        email: 'bcc1@e-potek.ch',
        type: 'bcc',
      },
    ]);
  });
});
