/* eslint-env mocha */
import { expect } from 'chai';

import testRequire from '/imports/js/helpers/testHelpers/testRequire';

const { default: Header, getLink } =
  testRequire('../Header') || require('../Header');

describe('BorrowerPage Header', () => {
  describe('getLink', () => {
    it('returns the right link', () => {
      expect(getLink('a', 'b', '/app/requests/c/borrowers/d/a')).to.equal(
        '/app/requests/c/borrowers/b/a',
      );
    });
  });
});
