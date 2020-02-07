/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { IntlProvider, intlShape } from 'react-intl';
import { mount } from 'core/utils/testHelpers/enzyme';

import DefaultTranchePicker, { TranchePicker } from '../../TranchePicker';
import Tranche from '../../Tranche';

describe('TranchePicker', () => {
  let props;
  const { intl } = new IntlProvider({ defaultLocale: 'fr' }).getChildContext();
  const component = () =>
    mount(<DefaultTranchePicker {...props} />, {
      context: { intl },
      childContextTypes: { intl: intlShape },
    });

  beforeEach(() => {
    props = { types: ['interest10', 'interest2', 'interest5'] };
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
    let input = wrapper.find('.value').first();

    expect(input.prop('value')).to.equal(1);

    input.prop('onChange')(0.8);

    wrapper.update();
    input = wrapper.find('.value').first();

    expect(input.prop('value')).to.equal(0.8);
    expect(wrapper.find(TranchePicker).props().tranches).to.deep.equal([
      { value: 0.8, type: 'test' },
    ]);
  });

  it('edits type with the Select field', () => {
    props.initialTranches = [{ value: 1, type: 'type1' }];
    const wrapper = component();
    let select = wrapper.find('.select').first();

    expect(select.prop('value')).to.equal('type1');

    select.props().onChange('type2');

    wrapper.update();
    select = wrapper.find('.select').first();

    expect(select.prop('value')).to.equal('type2');
    expect(wrapper.find(TranchePicker).props().tranches).to.deep.equal([
      { value: 1, type: 'type2' },
    ]);
  });

  it('filters options passed to a tranche', () => {
    props.initialTranches = [
      { value: 1, type: 'interest2' },
      { value: 1, type: 'interest5' },
    ];
    const wrapper = component();
    const firstTranche = wrapper.find(Tranche).first();

    expect(firstTranche.prop('options').map(({ id }) => id)).to.deep.equal([
      'interest2',
      'interest10',
    ]);
  });

  it('sorts options properly', () => {
    props.types = [
      'interest20',
      'interest15',
      'interest5',
      'interest10',
      'interest2',
    ];
    props.initialTranches = [{ value: 1, type: 'interest2' }];
    const wrapper = component();
    const firstTranche = wrapper.find(Tranche).first();

    expect(firstTranche.prop('options').map(({ id }) => id)).to.deep.equal([
      'interest2',
      'interest5',
      'interest10',
      'interest15',
      'interest20',
    ]);
  });
});
