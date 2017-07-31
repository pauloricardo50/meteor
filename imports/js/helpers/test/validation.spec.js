/* eslint-env mocha */
import { expect } from 'chai';

import { emailValidation } from '../validation';

describe('email validation', () => {
  it('works', () => {
    expect(emailValidation('flo@mail.com')).to.be.true;
    expect(emailValidation('flo@mail.c')).to.be.true;
    expect(emailValidation('flo@mail.')).to.be.false;
    expect(emailValidation('flomail.com')).to.be.false;
    expect(emailValidation('@mail.com')).to.be.false;
  });
});
