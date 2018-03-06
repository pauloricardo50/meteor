/* eslint-env mocha */
import { expect } from 'chai';

import Header, { getLink } from '../BorrowerHeader';

describe('BorrowerHeader', () => {
  describe('getLink', () => {
    it('returns the right link', () => {
      expect(getLink('a', 'b', '/loans/c/borrowers/d/a')).to.equal('/loans/c/borrowers/b/a');
    });
  });
});
