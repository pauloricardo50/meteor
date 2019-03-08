import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import SecurityService from '../../security';
import { generatePDF } from '../methodDefinitions';
import PDFService from './PDFService';
import { PDF_TYPES } from '../pdfConstants';
import Loans from '../../loans';
import Organisations from '../../organisations';

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
      const loanId = Loans.findOne({ name: loanName })._id;
      const organisationId = orgName
        ? Organisations.findOne({ name: orgName })._id
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
      }).then((html) => {
        console.log('Writing test PDF to ~/Desktop/pdf-testing.html');
        const homedir = require('os').homedir();
        fs.writeFileSync(`${homedir}/Desktop/pdf-test.html`, html);
      });
    });
  }
});
