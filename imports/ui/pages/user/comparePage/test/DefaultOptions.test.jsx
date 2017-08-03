import React from 'react';
import { expect } from 'chai';
import { describe, it } from 'meteor/practicalmeteor:mocha';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';

import getMountedComponent from '/imports/js/helpers/testHelpers';
import DefaultOptions from '../DefaultOptions.jsx';
import BorrowerOptions from '../BorrowerOptions.jsx';
import TextInput from '/imports/ui/components/general/TextInput.jsx';

describe('<DefaultOptions />', () => {
  let comparator;
  let wrapper;

  beforeEach(() => {
    getMountedComponent.reset(false);
    comparator = Factory.create('comparator');
    wrapper = shallow(
      <DefaultOptions comparator={comparator} changeComparator={() => {}} />,
    );
  });

  it('renders', () => {
    expect(wrapper.exists()).to.be.true;
  });

  it("doesn't renders BorrowerOptions if the prop use Borrowers is false", () => {
    expect(wrapper.find(BorrowerOptions).exists()).to.be.false;
  });

  it('renders 3 TextInput', () => {
    expect(wrapper.find(TextInput).length).to.equal(3);
  });

  if (Meteor.isClient) {
    it('mounts without errors', () => {
      const mounted = getMountedComponent(DefaultOptions, {
        comparator: { income: 0, fortune: 0 },
      });

      expect(mounted.exists()).to.be.true;
    });

    it('calls onChange after an input', () => {
      const handleChangeSpy = spy();
      const mounted = getMountedComponent(DefaultOptions, {
        comparator: { income: 0, fortune: 0 },
        changeComparator: handleChangeSpy,
      });
      const firstInput = mounted.find('input').first();

      expect(firstInput.exists()).to.be.true;
      expect(mounted.props('changeOptions')).to.not.equal(undefined);

      firstInput.simulate('input', { key: 'a', keyCode: 65, which: 65 });

      expect(handleChangeSpy.calledOnce).to.be.true;
    });
  }
});
