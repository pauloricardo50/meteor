/* eslint-env mocha */
import { expect } from 'chai';

import testRequire from 'core/utils/testHelpers/testRequire';

const { default: Header, getLink } =
  testRequire('../BorrowerHeader') || require('../BorrowerHeader');

describe('BorrowerHeader', () => {
  describe('getLink', () => {
    it('returns the right link', () => {
      expect(getLink('a', 'b', '/loans/c/borrowers/d/a')).to.equal('/loans/c/borrowers/b/a');
    });
  });
});
