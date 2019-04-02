/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import generator from '../../../factories';
import { ORGANISATION_TYPES, ORGANISATION_FEATURES } from '../../../constants';
import TaskService from '../../../tasks/server/TaskService';
import SecurityService from '../../../security';
import { generateData } from '../../../../utils/testHelpers';
import {
  requestLoanVerification,
  getMaxPropertyValueWithoutBorrowRatio,
} from '../../methodDefinitions';
import LoanService from '../LoanService';

let userId;
let adminId;

const generateOrganisationsWithLenderRules = ({
  number,
  mainBorrowRatio,
  secondaryBorrowRatio,
}) => {
  const { min: minMainBorrowRatio, max: maxMainBorrowRatio } = mainBorrowRatio;
  const {
    min: minSecondaryBorrowRatio,
    max: maxSecondaryBorrowRatio,
  } = secondaryBorrowRatio;
  let organisations = [];
  Array(number)
    .fill()
    .map((_, x) => x)
    .forEach((index) => {
      const mainRange = maxMainBorrowRatio - minMainBorrowRatio;
      const mainStep = mainRange / (number - 1);
      const secondaryRange = maxSecondaryBorrowRatio - minSecondaryBorrowRatio;
      const secondaryStep = secondaryRange / (number - 1);

      const main = minMainBorrowRatio + index * mainStep;
      const secondary = minSecondaryBorrowRatio + index * secondaryStep;

      organisations = [
        ...organisations,
        {
          _factory: 'organisation',
          name: `org${index}`,
          type: ORGANISATION_TYPES.BANK,
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: [
            { _factory: 'lenderRulesAll', order: 0 },
            { _factory: 'lenderRulesMain', maxBorrowRatio: main, order: 1 },
            { _factory: 'lenderRulesSecondary', maxBorrowRatio: secondary, order: 2 },
          ],
        },
      ];
    });

  return organisations;
};

describe('Loan methods', () => {
  beforeEach(() => {
    resetDatabase();

    const { user, admin } = generateData();
    userId = user._id;
    adminId = admin._id;

    [userId, adminId].forEach((variable) => {
      expect(variable).to.be.a('string');
    });
  });

  describe('requestLoanVerification', () => {
    beforeEach(() => {
      resetDatabase();
      sinon
        .stub(SecurityService.loans, 'isAllowedToUpdate')
        .callsFake(() => {});
    });

    afterEach(() => {
      SecurityService.loans.isAllowedToUpdate.restore();
    });

    it('inserts a task with the proper assignee and disables forms', () => {
      const admin = Factory.create('admin');
      const user = Factory.create('user', { assignedEmployeeId: admin._id });
      const loan = Factory.create('loan', { userId: user._id });
      const loanId = loan._id;

      expect(loan.userFormsEnabled).to.equal(true);

      return requestLoanVerification.run({ loanId: loan._id }).then(() => {
        const task = TaskService.findOne({ docId: loan.id });
        expect(task.assignedEmployeeId).to.equal(admin._id);
        expect(LoanService.get(loanId).userFormsEnabled).to.equal(false);
      });
    });
  });

  describe('setMaxPropertyValueWithoutBorrowRatio', function () {
    this.timeout(10000);
    beforeEach(() => {
      resetDatabase();
      sinon
        .stub(SecurityService.loans, 'isAllowedToUpdate')
        .callsFake(() => {});
    });

    afterEach(() => {
      SecurityService.loans.isAllowedToUpdate.restore();
    });

    it('finds the ideal borrowRatio', () => {
      generator({
        loans: {
          _id: 'loanId',
          _factory: 'loan',
          borrowers: [
            {
              _factory: 'borrower',
              bankFortune: 500000,
              salary: 1000000,
              insurance2: [{ value: 100000 }],
            },
          ],
        },
        organisations: [
          ...generateOrganisationsWithLenderRules({
            number: 5,
            mainBorrowRatio: { min: 0.65, max: 0.9 },
            secondaryBorrowRatio: { min: 0.5, max: 0.7 },
          }),
          {
            _factory: 'organisation',
            name: 'no lender rules',
            type: ORGANISATION_TYPES.BANK,
            features: [ORGANISATION_FEATURES.LENDER],
          },
        ],
      });

      return setMaxPropertyValueWithoutBorrowRatio
        .run({ loanId: 'loanId', canton: 'GE' })
        .then(() => {
          const {
            maxPropertyValue: { canton, date, main, second },
          } = LoanService.fetchOne({
            $filters: { _id: 'loanId' },
            maxPropertyValue: 1,
          });

          expect(canton).to.equal('GE');
          expect(moment(date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
          expect(main.min.borrowRatio).to.equal(0.65);
          expect(main.min.propertyValue).to.equal(1496000);
          expect(main.max.borrowRatio).to.equal(0.8713);
          expect(main.max.propertyValue).to.equal(3278000);
          expect(second.min.borrowRatio).to.equal(0.65);
          expect(second.min.propertyValue).to.equal(1244000);
          expect(second.max.borrowRatio).to.equal(0.7);
          expect(second.max.propertyValue).to.equal(1420000);
        });
    });
  });
});
