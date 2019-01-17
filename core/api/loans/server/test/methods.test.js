/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { Factory } from 'meteor/dburles:factory';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import TaskService from '../../../tasks/server/TaskService';
import SecurityService from '../../../security';
import { generateData } from '../../../../utils/testHelpers';
import { requestLoanVerification } from '../../methodDefinitions';
import LoanService from '../LoanService';

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
});
