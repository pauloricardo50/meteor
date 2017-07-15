import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { Meteor } from 'meteor/meteor';

import getMountedComponent from '/imports/js/helpers/testHelpers';
import DefaultOptions from '../DefaultOptions.jsx';
import BorrowerOptions from '../BorrowerOptions.jsx';
import TextInput from '/imports/ui/components/general/TextInput.jsx';

const setup = (options, props) =>
  shallow(
    <DefaultOptions
      options={{
        useBorrowers: false,
        income: 0,
        fortune: 0,
        insuranceFortune: 0,
        ...options,
      }}
      {...props}
    />,
  );

describe('<DefaultOptions />', () => {
  beforeEach(() => {
    getMountedComponent.reset(false);
  });

  it('renders', () => {
    const wrapper = setup();

    expect(wrapper.exists()).to.be.true;
  });

  it('renders BorrowerOptions if the prop use Borrowers is true', () => {
    const wrapper = setup({ useBorrowers: true });

    expect(wrapper.find(BorrowerOptions).exists()).to.be.true;
  });

  it("doesn't renders BorrowerOptions if the prop use Borrowers is false", () => {
    const wrapper = setup();

    expect(wrapper.find(BorrowerOptions).exists()).to.be.false;
  });

  it('renders 3 TextInput', () => {
    const wrapper = setup();

    expect(wrapper.find(TextInput).length).to.equal(3);
  });

  if (Meteor.isClient) {
    it('mounts without errors', () => {
      const wrapper = getMountedComponent(DefaultOptions, {
        options: { income: 0, fortune: 0 },
      });

      expect(wrapper.exists()).to.be.true;
    });

    it('calls onChange after an input', () => {
      const handleChangeSpy = spy();
      const wrapper = getMountedComponent(DefaultOptions, {
        options: { income: 0, fortune: 0 },
        changeOptions: handleChangeSpy,
      });
      const firstInput = wrapper.find('input').first();

      expect(firstInput.exists()).to.be.true;
      expect(wrapper.props('changeOptions')).to.not.equal(undefined);

      firstInput.simulate('input', { key: 'a', keyCode: 65, which: 65 });

      expect(handleChangeSpy.calledOnce).to.be.true;
    });
  }
});
