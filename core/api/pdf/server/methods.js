import { Meteor } from 'meteor/meteor';

import fs from 'fs';

import SecurityService from '../../security';
import { generatePDF } from '../methodDefinitions';
import PDFService from './PDFService';
import { PDF_TYPES } from '../pdfConstants';
import Loans from '../../loans';

generatePDF.setHandler((context, params) => {
  context.unblock();
  SecurityService.checkCurrentUserIsAdmin();
  return PDFService.makePDF(params);
});

// Enable this to iterate faster on pdfs
// Creates a new PDF on every startup to ~/Desktop/pdf-test.html
const PDF_TESTING = true;
const loanName = '19-0019';

Meteor.startup(() => {
  if (Meteor.isDevelopment && PDF_TESTING) {
    Meteor.defer(() => {
      const loanId = Loans.findOne({ name: loanName })._id;
      PDFService.makePDF({
        type: PDF_TYPES.LOAN,
        params: { loanId },
        options: { anonymous: false },
        htmlOnly: true,
      }).then((html) => {
        const homedir = require('os').homedir();

        fs.writeFileSync(`${homedir}/Desktop/pdf-test.html`, html);
      });
    });
  }
});
