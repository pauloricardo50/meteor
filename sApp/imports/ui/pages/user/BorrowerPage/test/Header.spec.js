/* eslint-env mocha */
import { expect } from 'chai';

import testRequire from 'core/utils/testHelpers/testRequire';

const { default: Header, getLink } =
  testRequire('../Header') || require('../Header');

describe('BorrowerPage Header', () => {
  describe('getLink', () => {
    it('returns the right link', () => {
      expect(getLink('a', 'b', '/requests/c/borrowers/d/a')).to.equal('/requests/c/borrowers/b/a');
    });
  });
});
