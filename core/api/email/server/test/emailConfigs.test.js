/* eslint-env mocha */
import { expect } from 'chai';

import { EMAIL_IDS } from '../../emailConstants';
import emailConfigs from '../emailConfigs';

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
