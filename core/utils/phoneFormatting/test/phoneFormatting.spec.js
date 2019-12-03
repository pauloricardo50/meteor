// @flow
/* eslint-env mocha */
import { expect } from 'chai';

import { formatPhoneNumber } from '..';

describe('formatPhoneNumber', () => {
  it('formats a swiss number', () => {
    expect(formatPhoneNumber('225660110')).to.equal('+41 22 566 01 10');
    expect(formatPhoneNumber('00412332')).to.equal('+41 2332');
    expect(formatPhoneNumber('22/566/01/10')).to.equal('+41 22 566 01 10');
    expect(formatPhoneNumber('22.566.01.10')).to.equal('+41 22 566 01 10');
  });

  it('does not format an incomplete swiss number', () => {
    expect(formatPhoneNumber('1')).to.equal('1');
    expect(formatPhoneNumber('12')).to.equal('+41 12');
    expect(formatPhoneNumber('22566011')).to.equal('+41 22566011');
  });

  it('formats foreign numbers properly', () => {
    expect(formatPhoneNumber('+33645781457')).to.equal('+33 6 45 78 14 57');
  });

  it('does not fail if undefined is passed', () => {
    expect(formatPhoneNumber(undefined)).to.equal(undefined);
  });

  it('does not fail if null is passed', () => {
    expect(formatPhoneNumber(null)).to.equal(null);
  });
});
