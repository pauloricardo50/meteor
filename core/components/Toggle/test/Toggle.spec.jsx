/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import Switch from '@material-ui/core/Switch';

import { shallow } from 'core/utils/testHelpers/enzyme';
import Toggle from '../Toggle';

const requiredProps = { toggle: false, onToggle: () => {} };

const component = props => shallow(<Toggle {...props} />);

describe('Toggle', () => {
  it('renders only the right label', () => {
    const labels = component({
      ...requiredProps,
      labelRight: 'Right Label',
    }).find('.toggle-label');
    expect(labels.length).to.equal(1);
    expect(labels.first().text()).to.equal('Right Label');
  });

  it('renders top, left and right labels', () => {
    const props = {
      ...requiredProps,
      labelTop: 'Top Label',
      labelLeft: 'Left Label',
      labelRight: 'Right Label',
    };
    const labels = component(props).find('.toggle-label');
    expect(labels.length).to.equal(3);
    expect(labels.at(0).text()).to.equal('Top Label');
    expect(labels.at(1).text()).to.equal('Left Label');
    expect(labels.at(2).text()).to.equal('Right Label');
  });

  it('passes the toggle callback function to the Switch component', () => {
    const onToggle = () => {};
    expect(component({ ...requiredProps, onToggle })
      .find(Switch)
      .first()
      .prop('onChange')).to.equal(onToggle);
  });
});
