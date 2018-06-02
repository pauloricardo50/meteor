import { expect } from 'chai';
import sinon from 'sinon';

import EventService from '../../../events';
import '../../../events/registerListeners';
import { disableUserFormsListener } from '../loanListeners';
import { requestLoanVerification } from '../../methodDefinitions';

import LoanService from '../../LoanService';

describe('Loan Listeners', () => {
  describe(`${requestLoanVerification.config.name} method listener`, () => {
    it(`listens to \`${requestLoanVerification.config.name}\` method`, () => {
      const {
        config: { name: methodName },
      } = requestLoanVerification;

      const listeners = EventService.getListenerFunctions(methodName);
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
