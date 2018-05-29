/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from '../../../utils/testHelpers/enzyme';

import {
  AutoTooltip,
  createRegexThatFindsAnyWordFromList,
} from '../AutoTooltip';
import { TOOLTIP_LISTS } from '../../../arrays/tooltips';

describe('<AutoTooltip />', () => {
  let props;
  const component = () => shallow(<AutoTooltip {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('returns null if no children are given ', () => {
    expect(component().getElement()).to.equal(null);
  });

  it('returns a span with text if a child is provided', () => {
    props = { children: 'test' };
    expect(component().equals(<span>test</span>)).to.equal(true);
  });

  it('returns the child if it is not a string', () => {
    props = { children: <div>test</div> };
    expect(component().equals(<div>test</div>)).to.equal(true);
  });

  it('returns a parsed string with tooltips', () => {
    const text = 'a match1 b';
    props = { children: text, tooltipList: TOOLTIP_LISTS.DEV };
    expect(component().text()).to.equal('a <TooltipOverlay /> b');
  });

  it('returns a parsed string with multiple tooltips', () => {
    const text = 'a match1 b match2 c';
    props = { children: text, tooltipList: TOOLTIP_LISTS.DEV };
    expect(component().text()).to.equal('a <TooltipOverlay /> b <TooltipOverlay /> c');
  });

  it('takes a list as a string to take tooltips from', () => {
    const text = 'a 123test b';
    props = { children: text, tooltipList: TOOLTIP_LISTS.OFFER_TABLE };
    expect(component().text()).to.equal('a 123test b');
  });

  it('throws if a non existent list is provided', () => {
    props = { tooltipList: 'yo', children: 'test' };
    expect(() => component()).to.throw();
  });

  it('returns null if no list is provided', () => {
    expect(createRegexThatFindsAnyWordFromList()).to.equal(null);
  });
});
