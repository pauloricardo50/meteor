/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';

import ServerEventService from '../../../events/server/ServerEventService';
import '../../../events/server/registerServerListeners';
import { requestLoanVerification } from '../../methodDefinitions';
import { disableUserFormsListener } from '../loanListeners';
import LoanService from '../LoanService';

describe('Loan Listeners', () => {
  describe('disableUserFormsListener', () => {
    it(`listens to '${requestLoanVerification.config.name}' method`, () => {
      const {
        config: { name: methodName },
      } = requestLoanVerification;

      const listeners = ServerEventService.getListenerFunctions(methodName);
      expect(listeners.includes(disableUserFormsListener)).to.equal(true);
    });

    it('calls `LoanService.disableUserForms` in order to disable the user forms', () => {
      const loanId = 'someLoanId';
      sinon.stub(LoanService, 'disableUserForms');

      expect(LoanService.disableUserForms.called).to.equal(false);
      disableUserFormsListener({ loanId });
      expect(LoanService.disableUserForms.getCall(0).args).to.deep.equal([
        { loanId },
      ]);

      LoanService.disableUserForms.restore();
    });
  });
});
