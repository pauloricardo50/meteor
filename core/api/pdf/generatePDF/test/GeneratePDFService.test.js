/* eslint-env mocha */
import { expect } from 'chai';
import base64 from 'base64topdf';
import fs from 'fs';
import cheerio from 'cheerio';

import { resetDatabase } from 'meteor/xolvio:cleaner';
import {
  PROPERTY_TYPE,
  RESIDENCE_TYPE,
  PURCHASE_TYPE,
  CIVIL_STATUS,
  PDF_TYPES,
} from 'core/api/constants';
import PDFService from '../PDFService';

import { getTwoBorrowersLoan, getFullLoan } from './testFactories';
import { GENDER } from '../../../core/api/constants';
import { FAKE_USER } from './testFactories/fakes';

describe('GeneratePDFService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('returns a base64 encoded PDF', () => {
    // const loanId = getSingleBorrowerLoan({
    //   borrowers: {
    //     borrowerInfos: {
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       gender: GENDER.M,
    //       age: 51,
    //       childrenCount: 2,
    //       civilStatus: CIVIL_STATUS.MARRIED,
    //     },
    //     withSalary: true,
    //     withBonus: true,
    //     withBankFortune: true,
    //     withInsurance2: true,
    //     withInsurance3A: true,
    //     withBank3A: true,
    //     withInsurance3B: true,
    //     withThirdPartyFortune: true,
    //     withOtherIncome: true,
    //     withOtherFortune: true,
    //     withExpenses: true,
    //     withRealEstate: true,
    //   },
    //   structures: [
    //     {
    //       withBankWithdraw: true,
    //       withInsurance3APledge: true,
    //       withThirdPartyFortuneWithdraw: true,
    //     },
    //     {
    //       withCustomNotaryFees: true,
    //       withBankWithdraw: true,
    //       withInsurance3AWithdraw: true,
    //     },
    //   ],
    //   propertyType: PROPERTY_TYPE.FLAT,
    // });
    const loanId = getTwoBorrowersLoan({
      purchaseType: PURCHASE_TYPE.ACQUISITION,
      residenceType: RESIDENCE_TYPE.MAIN_RESIDENCE,
      borrowers: [
        {
          borrowerInfos: {
            firstName: 'John',
            lastName: 'Doe',
            gender: GENDER.M,
            age: 51,
            childrenCount: 2,
            civilStatus: CIVIL_STATUS.MARRIED,
            zipCode: 1400,
            city: 'Yverdon-les-Bains',
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
            age: 49,
            company: "McDonald's",
            civilStatus: CIVIL_STATUS.MARRIED,
            zipCode: 1400,
            city: 'Yverdon-les-Bains',
          },
          withSalary: true,
          withInsurance2: true,
        },
      ],
      structures: [
        {
          withBankWithdraw: true,
          withInsurance3APledge: true,
          withThirdPartyFortuneWithdraw: true,
        },
        {
          withCustomNotaryFees: true,
          withBankWithdraw: true,
          withInsurance3AWithdraw: true,
        },
      ],
      propertyType: PROPERTY_TYPE.FLAT,
    });

    const loan = getFullLoan(loanId);

    return PDFService.generateDataAsPDF(
      { data: { ...loan, ...FAKE_USER }, type: PDF_TYPES.LOAN },
      true,
    )
      .then((response) => {
        const file = fs.readFileSync('/tmp/pdf_output.html', 'utf8');
        const $ = cheerio.load(file);

        base64.base64Decode(response.base64, '/tmp/pdf_output.pdf');
        expect(base64.base64ToStr(response.base64)).to.include('PDF');
      })
      .catch(console.log);
  });
});
