/* eslint-env mocha */
import { expect } from 'chai';

import { createAccountsEmailConfig } from '../accountsEmails';

describe('accountsEmails', () => {
  describe('createAccountsEmailConfig', () => {
    it('returns an object with functions subject and html', () => {
      const sampleConfig = createAccountsEmailConfig();
      expect(Object.keys(sampleConfig)).to.deep.equal(['subject', 'html']);
      expect(typeof sampleConfig.subject).to.equal('function');
      expect(typeof sampleConfig.html).to.equal('function');
    });
  });
});
