/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import moment from 'moment';

import generator from 'core/api/factories/index';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import TaskService from '../../../tasks/server/TaskService';
import SecurityService from '../../../security';
import { generateData } from '../../../../utils/testHelpers';
import {
  requestLoanVerification,
  getMaxPropertyValueWithoutBorrowRatio,
} from '../../methodDefinitions';
import LoanService from '../LoanService';
import { CANTONS } from '../../loanConstants';

let userId;
let adminId;

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

  describe('getMaxPropertyValueWithoutBorrowRatio', () => {
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
      });

      return getMaxPropertyValueWithoutBorrowRatio
        .run({ loanId: 'loanId', canton: 'ZH' })
        .then(() => {
          const {
            maxSolvency: { canton, date, main, second },
          } = LoanService.fetchOne({
            $filters: { _id: 'loanId' },
            maxSolvency: 1,
          });

          expect(canton).to.equal('ZH');
          expect(moment(date).format('YYYY-MM-DD')).to.equal(moment().format('YYYY-MM-DD'));
          expect(main.propertyValue).to.equal(2400000);
          expect(main.borrowRatio).to.equal(0.8);
          expect(second.propertyValue).to.equal(2000000);
          expect(second.borrowRatio).to.equal(0.8);
        });
    });
  });
});
