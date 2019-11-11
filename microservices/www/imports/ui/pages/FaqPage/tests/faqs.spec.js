/* eslint-env mocha */
import { expect } from 'chai';
import isArray from 'lodash/isArray';

import messages from '../../../../../lang/fr.json';
import faqs from '../faqs';

describe('faqs', () => {
  it('is an object of non-empty arrays', () => {
    expect(typeof faqs).to.equal('object');
    expect(Object.keys(faqs).length).to.be.least(1);
    Object.keys(faqs).forEach(category => {
      expect(isArray(faqs[category])).to.equal(true, category);
      expect(faqs[category].length).to.be.least(1, category);
    });
  });

  it('has a defined question and answer for each faq', () => {
    Object.keys(faqs).forEach(category => {
      faqs[category].forEach(faq => {
        expect(messages[`FaqPageFaqs.${faq}.question`]).to.not.equal(
          undefined,
          faq,
        );
        expect(messages[`FaqPageFaqs.${faq}.answer`]).to.not.equal(
          undefined,
          faq,
        );
      });
    });
  });
});
