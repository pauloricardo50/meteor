import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';

import formatMessage from '../intl';

describe('intl-server', () => {
  it('works for an existing id', () => {
    expect(formatMessage('general.yes')).to.equal('Oui');
  });

  it('formats additional values property', () => {
    expect(formatMessage('BorrowerHeader.title', { index: 10 })).to.equal('Emprunteur 10');
  });

  it('returns the id if the message is unknown', () => {
    const id = 'asdftre.adshwe.rta-trewt';
    expect(formatMessage(id)).to.equal(id);
  });

  it('throws if no id is provided', () => {
    expect(() => formatMessage()).to.throw;
  });
});
