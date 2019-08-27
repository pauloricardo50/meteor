/* eslint-env mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { checkEmails } from 'core/utils/testHelpers/index';
import methods from '../../registerMethodDefinitions';
import { getRateLimitedMethods } from '../../../../utils/rate-limit';
import { submitContactForm } from '../../methodDefinitions';
import { EMAIL_IDS } from '../../../email/emailConstants';

describe('methods', function () {
  this.timeout(10000);

  beforeEach(() => {
    resetDatabase();
  });

  Object.keys(methods).forEach((methodName) => {
    const method = methods[methodName];
    describe(`method ${methodName}`, () => {
      it('is defined', () =>
        method.run({}).catch((error) => {
          expect(error.error).to.not.equal(404);
        }));

      // In the future, remove the if conditional to test that all methods
      // are rate-limited
      // if (methodName === 'impersonateUser') {
      //   it('is rate-limited', () => {
      //     expect(getRateLimitedMethods()).to.include(methodName);
      //   });
      // }
    });
  });

  describe('submitContactForm', () => {
    it('should send 2 emails', () => {
      const address = 'digital@e-potek.ch';
      return submitContactForm
        .run({
          name: 'Florian Bienefelt',
          email: address,
          phoneNumber: '+41 22 566 01 10',
        })
        .then(() => checkEmails(2))
        .then((emails) => {
          expect(emails.length).to.equal(2);
          const ids = emails.map(({ emailId }) => emailId);
          expect(ids).to.include(EMAIL_IDS.CONTACT_US);
          expect(ids).to.include(EMAIL_IDS.CONTACT_US_ADMIN);
        });
    });
  });
});
