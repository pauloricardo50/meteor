/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from '../../../utils/testHelpers/enzyme';
import { TooltipProvider, TooltipContainer } from '../TooltipContext';

describe('TooltipContext', () => {
  it.skip('passes tooltips down', () => {
    // FIXME: Can't test react context for now
    // https://github.com/airbnb/enzyme/pulls
    const id = 'test';
    const Component = TooltipContainer(({ tooltipList }) => <>{tooltipList}</>);
    const wrapper = mount(
      <TooltipProvider tooltipList={id}>
        <>
          <span>
            <Component />
          </span>
        </>
      </TooltipProvider>,
    );
    expect(wrapper.find(Component)).to.have.length(1);
    expect(
      wrapper
        .find(Component)
        .dive()
        .prop('tooltipList'),
    ).to.equal(true);
  });
});
