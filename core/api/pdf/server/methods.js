import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import Loans from '../../loans';
import LoanService from '../../loans/server/LoanService';
import Organisations from '../../organisations';
import OrganisationService from '../../organisations/server/OrganisationService';
import SecurityService from '../../security';
import { generatePDF } from '../methodDefinitions';
import { PDF_TYPES } from '../pdfConstants';
import PDFService from './PDFService';

generatePDF.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return PDFService.makePDF(params);
});

// Enable this to iterate faster on pdfs
// Creates a new PDF on every startup to ~/Desktop/pdf-test.html
const PDF_TESTING = false;
const loanName = '19-0077';
const orgName = 'Swisslife';

Meteor.startup(() => {
  if (Meteor.isDevelopment && PDF_TESTING) {
    Meteor.defer(() => {
      const loanId = LoanService.get({ name: loanName }, { _id: 1 })._id;
      const organisationId = orgName
        ? OrganisationService.get({ name: orgName }, { _id: 1 })._id
        : '';

      if (!loanId) {
        console.log(`Loan ${loanName} not found`);
        return;
      }

      PDFService.makePDF({
        type: PDF_TYPES.LOAN,
        params: { loanId, organisationId },
        options: { anonymous: false },
        htmlOnly: true,
      }).then(html => {
        console.log('Writing test PDF to ~/Desktop/pdf-testing.html');
        const homedir = require('os').homedir();
        fs.writeFileSync(`${homedir}/Desktop/pdf-test.html`, html);
      });
    });
  }
});
