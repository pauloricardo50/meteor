/* eslint-env mocha */
import { expect } from 'chai';

import Intl from '../intl';

describe('intl-server', () => {
  it('works for an existing id', () => {
    expect(Intl.formatMessage({ id: 'general.yes' })).to.equal('Oui');
  });

  it('formats additional values property', () => {
    expect(
      Intl.formatMessage({ id: 'BorrowerHeader.title', values: { index: 10 } }),
    ).to.equal('Emprunteur 10');
  });

  it('returns the id if the message is unknown', () => {
    const id = 'asdftre.adshwe.rta-trewt';
    expect(Intl.formatMessage({ id })).to.equal(id);
  });

  it('throws if no id is provided', () => {
    expect(() => Intl.formatMessage({})).to.throw;
  });

  it('uses the custom fallback if it is not undefined', () => {
    expect(Intl.formatMessage({ id: 'fakeId', fallback: 'custom' })).to.equal(
      'custom',
    );
    expect(Intl.formatMessage({ id: 'fakeId', fallback: '' })).to.equal('');
  });
});
