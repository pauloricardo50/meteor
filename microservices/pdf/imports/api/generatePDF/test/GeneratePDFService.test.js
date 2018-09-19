/* eslint-env mocha */
import { expect } from 'chai';
import base64 from 'base64topdf';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import PDFService from '../PDFService';
import { PDF_TYPES } from '../constants';

import {
  getSingleBorrowerLoan,
  getTwoBorrowersLoan,
  getFullLoan,
} from './testFactories';
import { GENDER } from '../../../core/api/constants';
import { FAKE_USER } from './testFactories/fakes';

describe.only('GeneratePDFService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('returns a base64 encoded PDF', () => {
    const loanId = getTwoBorrowersLoan([
      {
        borrowerInfos: { firstName: 'John', lastName: 'Doe', gender: GENDER.M },
        withSalary: true,
      },
      {
        borrowerInfos: {
          firstName: 'Maria',
          lastName: 'Doe',
          gender: GENDER.F,
        },
        withBankFortune: true,
      },
    ]);

    const loan = getFullLoan(loanId);

    return PDFService.generateDataAsPDF({
      data: {
        loan: {
          ...loan,
          ...FAKE_USER,
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
      .catch(console.log);
  });
});
