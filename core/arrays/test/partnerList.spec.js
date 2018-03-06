/* eslint-env mocha */
import { expect } from 'chai';

import { getPartnerList } from '../partnerList';

describe('getPartnerList', () => {
  it('returns an array of objects', () => {
    const list = getPartnerList('GE', '');
    expect(typeof list).to.equal('object');
    expect(list).to.have.length.above(0);
    list.forEach(partner => expect(typeof partner).to.equal('object'));
  });

  it('filters out partners to avoid', () => {
    const base = getPartnerList('GE');
    const filtered = getPartnerList('GE', ['banqueDuLeman']);

    expect(base.length).to.equal(filtered.length + 1);
    expect(!!filtered.find(partner => partner.key === 'banqueDuLeman')).to.be
      .false;
  });

  it("doesn't filter anything if the partner doesn't exist in the canton", () => {
    const base = getPartnerList('VD');
    const filtered = getPartnerList('VD', ['banqueDuLeman']);

    expect(base.length).to.equal(filtered.length);
  });

  it("doesn't filter anything if the partner doesn't exist in the list", () => {
    const base = getPartnerList('GE');
    const filtered = getPartnerList('GE', ['fakePartner']);

    expect(base.length).to.equal(filtered.length);
  });
});
