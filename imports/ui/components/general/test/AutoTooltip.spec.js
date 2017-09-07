/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import testRequire from '/imports/js/helpers/testRequire';

const { default: AutoTooltip } =
  testRequire('../AutoTooltip') || require('../AutoTooltip');

const { default: TooltipOverlay } =
  testRequire('../TooltipOverlay') || require('../TooltipOverlay');

describe('<AutoTooltip />', () => {
  it('returns null if no children are given', () => {
    const wrapper = shallow(<AutoTooltip />);
    expect(wrapper.type()).to.equal(null);
  });

  it('returns a span with text if a child is provided', () => {
    const wrapper = shallow(<AutoTooltip>test</AutoTooltip>);
    expect(!!wrapper.get(0)).to.equal(true);
    expect(wrapper.equals(<span>test</span>)).to.equal(true);
  });

  it('returns the child if it is not a string', () => {
    const wrapper = shallow(
      <AutoTooltip>
        <div>test</div>
      </AutoTooltip>,
    );
    expect(wrapper.equals(<div>test</div>)).to.equal(true);
  });

  it('returns the child wrapped in a tooltip if an id is provided', () => {
    const text = 'this is a test';
    const wrapper = shallow(
      <AutoTooltip id="test">
        {text}
      </AutoTooltip>,
    );
    expect(wrapper.find('TooltipOverlay')).to.have.length(1);
    expect(wrapper.find('TooltipOverlay').childAt(0).text()).to.equal(text);
    expect(wrapper.find('TooltipOverlay').prop('id')).to.equal('test');
  });

  it('returns a parsed string with tooltips', () => {
    const text = 'a finma b';
    const wrapper = shallow(
      <AutoTooltip>
        {text}
      </AutoTooltip>,
    );

    expect(wrapper.text()).to.equal('a <TooltipOverlay /> b');
  });

  it('returns a parsed string with multiple tooltips', () => {
    const text = 'a finma b finma c';
    const wrapper = shallow(
      <AutoTooltip>
        {text}
      </AutoTooltip>,
    );

    expect(wrapper.text()).to.equal(
      'a <TooltipOverlay /> b <TooltipOverlay /> c',
    );
  });

  it('takes a list as a string to take tooltips from', () => {
    const text = 'a 123test b';
    const wrapper = shallow(
      <AutoTooltip list="table">
        {text}
      </AutoTooltip>,
    );

    expect(wrapper.text()).to.equal('a 123test b');
  });

  it('throws if a non existent list is provided', () => {
    expect(() => shallow(<AutoTooltip list="yo">test</AutoTooltip>)).to.throw();
  });
});
