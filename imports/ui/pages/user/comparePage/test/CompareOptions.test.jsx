import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';
import { Meteor } from 'meteor/meteor';

import getMountedComponent from '/imports/js/helpers/testHelpers';
import CompareOptions from '../CompareOptions.jsx';

import DefaultOptions from '../DefaultOptions.jsx';
import AdvancedOptions from '../AdvancedOptions.jsx';

describe('<CompareOptions />', () => {
  const component = () => getMountedComponent(CompareOptions, { options: {} });

  beforeEach(() => {
    getMountedComponent.reset(false);
  });

  it('renders', () => {
    const wrapper = shallow(<CompareOptions options={{}} />);
    expect(wrapper.exists()).to.be.true;
    expect(wrapper.name()).to.equal('div');
  });

  it('has a mask1 class on it', () => {
    const wrapper = shallow(<CompareOptions options={{}} />);
    expect(wrapper.hasClass('mask1')).to.be.true;
  });

  it('renders only the default options by default', () => {
    const wrapper = shallow(<CompareOptions options={{}} />);

    expect(wrapper.find(DefaultOptions).exists()).to.be.true;
    expect(wrapper.find(AdvancedOptions).exists()).to.be.false;
  });

  it('has default state on start', () => {
    const wrapper = shallow(<CompareOptions options={{}} />);
    expect(wrapper.state()).to.deep.equal({ showAdvanced: false });
  });

  it('changes state with handleClick', (done) => {
    const wrapper = shallow(<CompareOptions options={{}} />);
    wrapper.instance().handleClick(() => {
      expect(wrapper.state()).to.deep.equal({ showAdvanced: true });
      done();
    });
  });

  if (Meteor.isClient) {
    // Otherwise it needs jsdom to work
    it('renders the advanced options after clicking on the button', (done) => {
      expect(component().find(DefaultOptions).exists()).to.be.true;
      expect(component().find(AdvancedOptions).exists()).to.be.false;

      // Simulate click
      component().instance().handleClick(() => {
        expect(component().find(DefaultOptions).exists(), 'default is true').to.be
          .true;
        expect(component().find(AdvancedOptions).exists(), 'advanced is true').to.be
          .true;
        done();
      });
    });
  }
});
