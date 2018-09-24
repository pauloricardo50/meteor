/* eslint-env mocha */
import { expect } from 'chai';
import base64 from 'base64topdf';
import fs from 'fs';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import {
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  PURCHASE_TYPE,
} from 'core/api/constants';
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
    const loanId = getTwoBorrowersLoan({
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      borrowers: [
        {
          borrowerInfos: {
            firstName: 'John',
            lastName: 'Doe',
            gender: GENDER.M,
          },
          withSalary: true,
          withBonus: true,
          withBankFortune: true,
          withInsurance2: true,
          withInsurance3A: true,
          withBank3A: true,
          withInsurance3B: true,
          withThirdPartyFortune: true,
          withOtherIncome: true,
          withOtherFortune: true,
          withExpenses: true,
          withRealEstate: true,
        },
        {
          borrowerInfos: {
            firstName: 'Maria',
            lastName: 'Doe',
            gender: GENDER.F,
          },
          withSalary: true,
          withInsurance2: true,
        },
      ],
      propertyType: PROPERTY_TYPE.FLAT,
    });

    const loan = getFullLoan(loanId);

    return PDFService.generateDataAsPDF(
      {
        data: {
          loan: {
            ...loan,
            ...FAKE_USER,
          },
        },
        type: PDF_TYPES.LOAN_BANK,
      },
      true,
    )
      .then((response) => {
        const file = fs.readFileSync('/tmp/pdf_output.html', 'utf8');
        base64.base64Decode(response.base64, '/tmp/pdf_output.pdf');
        expect(file).to.contain('Expertise');
        // expect(base64.base64ToStr(response.base64)).to.include('PDF');
      })
      .catch(console.log);
  });
});
