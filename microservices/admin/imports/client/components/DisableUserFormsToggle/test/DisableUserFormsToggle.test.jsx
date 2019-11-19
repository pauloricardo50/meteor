/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Toggle';
import DisableUserFormsToggle from '../DisableUserFormsToggle';

const component = (props = { loan: { userFormsEnabled: true } }) =>
  shallow(<DisableUserFormsToggle {...props} />);

const getLabel = (comp, labelSelector) =>
  comp
    .find(Toggle)
    .first()
    .find(labelSelector)
    .first();

const completeProps = {
  loan: { _id: '123', userFormsEnabled: true },
  labelTop: 'Top Label',
  labelLeft: 'Left Label',
  labelRight: 'Right Label',
};

describe('DisableUserFormsToggle', () => {
  it('renders a Toggle component', () => {
    expect(component().find(Toggle).length).to.equal(1);
  });

  it('renders the top label', () => {
    expect(
      component(completeProps)
        .find(Toggle)
        .prop('labelTop'),
    ).to.deep.equal(<T id="Forms.userFormsEnabled" />);
  });

  it('renders the left label', () => {
    expect(
      component(completeProps)
        .find(Toggle)
        .prop('labelLeft'),
    ).to.deep.equal(<T id="general.no" />);
  });

  it('renders the right label', () => {
    expect(
      component(completeProps)
        .find(Toggle)
        .prop('labelRight'),
    ).to.deep.equal(<T id="general.yes" />);
  });

  it('is toggled on when user forms are enabled', () => {
    const props = { loan: { userFormsEnabled: true } };
    const toggles = component(props).find(Toggle);
    expect(toggles.first().prop('toggled')).to.equal(true);
  });

  it('is toggled off when user forms are disabled', () => {
    const props = { loan: { userFormsEnabled: false } };
    const toggles = component(props).find(Toggle);
    expect(toggles.first().prop('toggled')).to.equal(false);
  });

  it('passes a disable function', () => {
    const onToggle = component(completeProps)
      .find(Toggle)
      .prop('onToggle');

    expect(onToggle).to.be.a('function');
  });
});
