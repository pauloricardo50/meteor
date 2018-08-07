// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';

import DefaultTranchePicker, { TranchePicker } from '../TranchePicker';

describe.only('TranchePicker', () => {
  let props;
  const component = () => mount(<DefaultTranchePicker {...props} />);

  beforeEach(() => {
    props = { types: ['type1', 'type2', 'type3'] };
  });

  it('adds a tranche', () => {
    const wrapper = component();
    const button = wrapper.find('.add').first();

    expect(wrapper.find('.tranche').length).to.equal(0);

    button.simulate('click');

    expect(wrapper.find('.tranche').length).to.equal(1);
  });

  it('removes a tranche', () => {
    props.initialTranches = [{ value: 1, type: 'test' }];
    const wrapper = component();
    const deleteButton = wrapper.find('.delete').first();

    expect(wrapper.find('.tranche').length).to.equal(1);

    deleteButton.simulate('click');

    expect(wrapper.find('.tranche').length).to.equal(0);
  });

  it('edits a tranche with an input', () => {
    props.initialTranches = [{ value: 1, type: 'test' }];
    const wrapper = component();
    let input = wrapper.find('input').first();

    expect(input.prop('value')).to.equal(1);

    input.simulate('change', { target: { value: 100 } });

    wrapper.update();
    input = wrapper.find('input').first();

    expect(input.prop('value')).to.equal(100);
    expect(wrapper.find(TranchePicker).props().tranches).to.deep.equal([
      { value: 100, type: 'test' },
    ]);
  });

  it('edits type with the Select field', () => {
    props.initialTranches = [{ value: 1, type: 'type1' }];
    const wrapper = component();
    let select = wrapper.find('.select').first();

    expect(select.prop('value')).to.equal('type1');

    select.props().onChange(null, 'type2');

    wrapper.update();
    select = wrapper.find('.select').first();

    expect(select.prop('value')).to.equal('type2');
    expect(wrapper.find(TranchePicker).props().tranches).to.deep.equal([
      { value: 1, type: 'type2' },
    ]);
  });
});
