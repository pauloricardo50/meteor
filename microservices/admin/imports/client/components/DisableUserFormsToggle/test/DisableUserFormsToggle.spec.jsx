/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import merge from 'lodash/merge';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Material/Toggle';
import { disableUserForms, enableUserForms } from 'core/api';

import DisableUserFormsToggle from '../DisableUserFormsToggle';

const component = (props = { loan: { userFormsEnabled: true } }) =>
  shallow(<DisableUserFormsToggle {...props} />);

const getLabel = (component, labelSelector) =>
  component
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
    expect(component(completeProps)
      .find(Toggle)
      .prop('labelTop')).to.deep.equal(<T id="DisableUserFormsToggle.canEdit" />);
  });

  it('renders the left label', () => {
    expect(component(completeProps)
      .find(Toggle)
      .prop('labelLeft')).to.deep.equal(<T id="general.no" />);
  });

  it('renders the right label', () => {
    expect(component(completeProps)
      .find(Toggle)
      .prop('labelRight')).to.deep.equal(<T id="general.yes" />);
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

  it('enables the user forms when toggled on', () => {
    const toggledOffProps = {
      loan: { _id: '1234', userFormsEnabled: false },
      labelTop: 'top',
      labelLeft: 'left',
      labelRight: 'right',
    };
    const onToggle = component(toggledOffProps)
      .find(Toggle)
      .prop('onToggle');

    sinon.stub(enableUserForms, 'run');
    onToggle(null, true);

    expect(enableUserForms.run.getCall(0).args).to.deep.equal([
      {
        loanId: '1234',
      },
    ]);

    enableUserForms.run.restore();
  });

  it('disables the user forms when toggled off', () => {
    const toggledOnProps = {
      loan: { _id: '1234', userFormsEnabled: true },
      labelTop: 'top',
      labelLeft: 'left',
      labelRight: 'right',
    };
    const onToggle = component(toggledOnProps)
      .find(Toggle)
      .prop('onToggle');

    sinon.stub(disableUserForms, 'run');
    onToggle(null, false);

    expect(disableUserForms.run.getCall(0).args).to.deep.equal([
      {
        loanId: '1234',
      },
    ]);

    disableUserForms.run.restore();
  });
});
