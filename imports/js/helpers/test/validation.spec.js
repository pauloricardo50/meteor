/* eslint-env mocha */
import { expect } from 'chai';

import { emailValidation } from '../validation';

describe('email validation', () => {
  it('works', () => {
    expect(emailValidation('flo@mail.com')).to.equal(true);
    expect(emailValidation('flo@mail.c')).to.equal(true);
    expect(emailValidation('flo@mail.')).to.equal(false);
    expect(emailValidation('flomail.com')).to.equal(false);
    expect(emailValidation('@mail.com')).to.equal(false);
  });
});
