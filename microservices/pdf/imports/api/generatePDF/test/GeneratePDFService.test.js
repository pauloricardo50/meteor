/* eslint-env mocha */
import { expect } from 'chai';

import base64 from 'base64topdf';

import PDFService from '../PDFService';
import { PDF_TYPES } from '../constants';

describe.only('GeneratePDFService', () => {
  it('returns a base64 encoded PDF', () =>
    PDFService.generateDataAsPDF({
      data: {
        loan: {
          name: '18-0151',
          user: { assignedEmployee: { name: 'Joel Santos' } },
        },
      },
      type: PDF_TYPES.LOAN_BANK,
    })
      .then((response) => {
        base64.base64Decode(
          response.base64,
          '/Users/quentinherzig/Desktop/main.pdf',
        );
        expect(base64.base64ToStr(response.base64)).to.include('PDF');
      })
      .catch(console.log));
});
