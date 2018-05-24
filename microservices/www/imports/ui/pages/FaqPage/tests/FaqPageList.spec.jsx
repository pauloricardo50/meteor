/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import { FaqPageList } from '../FaqPageList';
import FaqPageFaqs from '../FaqPageFaqs';

describe('FaqPageList', () => {
  let props;
  const component = () => shallow(<FaqPageList {...props} />);

  beforeEach(() => {
    props = {
      faqList: {},
    };
  });

  it('renders a div with the right class', () => {
    const divs = component().find('div');
    expect(divs.length).to.be.at.least(1);
    expect(divs.first().hasClass('faq-page-list')).to.equal(true);
  });

  describe('for each category', () => {
    let categories;
    beforeEach(() => {
      props = { faqList: { category1: [], category2: [] } };
      categories = Object.keys(props.faqList);
    });

    it('renders a div with the right class and id', () => {
      const categoryDivs = component().find('.faq-page-list-category');
      expect(categoryDivs.length).to.equal(categories.length);

      categories.forEach((category, index) => {
        const div = categoryDivs.at(index);
        expect(div.prop('id')).to.equal(category);
      });
    });

    it('renders a h2', () => {
      const categoryDivs = component().find('.faq-page-list-category');

      categories.forEach((category, index) => {
        const div = categoryDivs.at(index);
        expect(div.find('h2').length).to.equal(1);
      });
    });

    it('renders faqs', () => {
      const categoryDivs = component().find('.faq-page-list-category');

      categories.forEach((category, index) => {
        const div = categoryDivs.at(index);
        expect(div.find(FaqPageFaqs).length).to.equal(1);
      });
    });
  });
});
