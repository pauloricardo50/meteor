/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import FaqPage from '../FaqPage';
import FaqPageList from '../FaqPageList';

describe('FaqPage', () => {
  const component = () => shallow(<FaqPage />);

  it('renders a div with the right class', () => {
    const divs = component().find('div');
    expect(divs.length).to.be.at.least(1);
    expect(divs.first().hasClass('faq-page-content')).to.equal(true);
  });

  it('renders a title', () => {
    const h1s = component().find('h1');
    expect(h1s.length).to.equal(1);
  });

  it('renders a FaqPageList', () => {
    const lists = component().find(FaqPageList);
    expect(lists.length).to.equal(1);
  });
});
