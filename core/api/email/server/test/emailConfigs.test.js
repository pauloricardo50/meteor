/* eslint-env mocha */
import { expect } from 'chai';

import emailConfigs from '../emailConfigs';
import { EMAIL_IDS } from '../../emailConstants';

describe('emailConfigs', () => {
  it('there is a config for each EMAIL_ID', () => {
    Object.keys(EMAIL_IDS).forEach(emailId => {
      expect(!!emailConfigs[emailId]).to.equal(
        true,
        `No config for ${emailId}`,
      );
    });
  });
});
