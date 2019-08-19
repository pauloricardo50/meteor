/* eslint-env mocha */
import { expect } from 'chai';

import { createRoute } from '../routerUtils';

describe('routerUtils', () => {
  describe('createRoute', () => {
    it('replaces wildcard params with real value', () => {
      expect(createRoute(':hello', { ':hello': 'yo' })).to.equal('yo');
    });

    it('replaces multiple wildcard params with real value', () => {
      expect(createRoute(':hello/:yo', { ':hello': 'yo', ':yo': 'dude' })).to.equal('yo/dude');
    });

    it('returns the initial path if no params are passed', () => {
      expect(createRoute('yo')).to.equal('yo');
    });

    it('prefixes replacers with a colon if none is provided', () => {
      expect(createRoute(':hello', { hello: 'yo' })).to.equal('yo');
      expect(createRoute(':hello/:yo', { hello: 'yo', yo: 'dude' })).to.equal('yo/dude');
    });

    it('replaces wildcard params while removing interrogation marks', () => {
      expect(createRoute('/abc/:hello?', { ':hello': '' })).to.equal('/abc/');
    });

    it('leaves the wildcard param if a replacer is not provided', () => {
      expect(createRoute(':hello/:yo', { ':hello': 'yo' })).to.equal('yo/:yo');
    });
  });
});
