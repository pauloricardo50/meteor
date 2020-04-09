/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from '../../../utils/testHelpers';
import { PageHead } from '../PageHead';

describe('PageHead', () => {
  let props;
  const component = () => shallow(<PageHead {...props} />);

  beforeEach(() => {
    props = { intl: { formatMessage: ({ id }) => id } };
  });

  it('renders a title tag with just e-Potek in it if no title is provided', () => {
    expect(component().props('title').title).to.equal('e-Potek');
  });

  it('renders a meta tag with a charSet', () => {
    expect(component().props().meta).to.deep.include({
      charSet: 'UTF-8',
    });
  });

  it('renders the title with more stuff if titleId is provided', () => {
    const titleId = 'yo';
    props.titleId = titleId;
    expect(component().props().title).to.equal(`e-Potek | ${titleId}.title`);
  });

  it('does not add .title at the end of the i18n id if it is already provided', () => {
    const titleId = 'yo.title';
    props.titleId = titleId;
    expect(component().props().title).to.equal(`e-Potek | ${titleId}`);
  });

  it('does not render a description tag if no descriptionId is provided', () => {
    expect(component().find('meta[name="description"]').length).to.equal(0);
  });

  it('renders a description tag if a descriptionId is provided', () => {
    const descriptionId = 'test';
    props.descriptionId = descriptionId;
    expect(component().props().meta).to.deep.include({
      name: 'description',
      content: descriptionId,
    });
  });
});
