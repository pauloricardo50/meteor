/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from '../../../utils/testHelpers/enzyme';

import { AutoTooltip } from '../AutoTooltip';
import { TOOLTIP_LISTS } from '../../../arrays/tooltips';

describe('<AutoTooltip />', () => {
  let props;
  const component = () => shallow(<AutoTooltip {...props} />);

  beforeEach(() => {
    props = {};
  });

  it('returns null if no children are given ', () => {
    const wrapper = component();
    expect(wrapper.getElement()).to.equal(null);
  });

  it('returns a span with text if a child is provided', () => {
    props = { children: 'test' };
    const wrapper = component();
    expect(!!wrapper.get(0)).to.equal(true);
    expect(wrapper.equals(<span>test</span>)).to.equal(true);
  });

  it('returns the child if it is not a string', () => {
    props = { children: <div>test</div> };
    const wrapper = component();
    expect(wrapper.contains(<div>test</div>)).to.equal(true);
  });

  it('returns a parsed string with tooltips', () => {
    const text = 'a match1 b';
    props = { children: text, tooltipList: TOOLTIP_LISTS.DEV };
    const wrapper = component();
    expect(wrapper.text()).to.equal('a <TooltipOverlay /> b');
  });

  it('returns a parsed string with multiple tooltips', () => {
    const text = 'a match1 b match2 c';
    props = { children: text, tooltipList: TOOLTIP_LISTS.DEV };
    const wrapper = component();
    expect(wrapper.text()).to.equal('a <TooltipOverlay /> b <TooltipOverlay /> c');
  });

  it('takes a list as a string to take tooltips from', () => {
    const text = 'a 123test b';
    props = { children: text, tooltipList: TOOLTIP_LISTS.OFFER_TABLE };
    const wrapper = component();

    expect(wrapper.text()).to.equal('a 123test b');
  });

  it('throws if a non existent list is provided', () => {
    props = { tooltipList: 'yo', children: 'test' };
    expect(() => component()).to.throw();
  });
});
