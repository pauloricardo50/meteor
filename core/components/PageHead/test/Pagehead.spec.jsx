/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';

import { PageHead } from '../PageHead';

describe('PageHead', () => {
  let props;
  const component = () => shallow(<PageHead {...props} />);

  beforeEach(() => {
    props = { intl: { formatMessage: ({ id }) => id } };
  });

  it('renders a title tag with just e-Potek in it if no title is provided', () => {
    expect(component().find('title').length).to.equal(1);
    expect(component()
      .find('title')
      .text()).to.equal('e-Potek');
  });

  it('renders a meta tag with a charSet', () => {
    expect(component().find('meta').length).to.equal(1);
    expect(component()
      .find('meta')
      .props().charSet).to.equal('utf-8');
  });

  it('renders the title with more stuff if titleId is provided', () => {
    const titleId = 'yo';
    props.titleId = titleId;
    expect(component().find('title').length).to.equal(1);
    expect(component()
      .find('title')
      .text()).to.equal(`e-Potek | ${titleId}`);
  });

  it('does not render a description tag if no descriptionId is provided', () => {
    expect(component().find('meta[name="description"]').length).to.equal(0);
  });

  it('renders a description tag if a descriptionId is provided', () => {
    const descriptionId = 'test';
    props.descriptionId = descriptionId;
    expect(component().find('meta[name="description"]').length).to.equal(1);
    expect(component()
      .find('meta[name="description"]')
      .props().content).to.equal(descriptionId);
  });
});
