/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import merge from 'lodash/merge';

import { shallow } from 'core/utils/testHelpers/enzyme';
import { T } from 'core/components/Translation';
import Toggle from 'core/components/Material/Toggle';
import { loanUpdate } from 'core/api';

import DisableUserFormsToggle from '../DisableUserFormsToggle';

const component = (props = { loan: {} }) =>
  shallow(<DisableUserFormsToggle {...props} />);

const getLabel = (component, labelSelector) =>
  component
    .find(Toggle)
    .first()
    .find(labelSelector)
    .first();

const completeProps = {
  loan: { _id: '123' },
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

  it('is toggled off by default', () => {
    const toggles = component().find(Toggle);
    expect(toggles.first().prop('toggled')).to.equal(false);
  });

  it('is toggled off when user forms are enabled', () => {
    const props = { loan: { userFormsDisabled: false } };
    const toggles = component(props).find(Toggle);
    expect(toggles.first().prop('toggled')).to.equal(false);
  });

  it('is toggled on when user forms are disabled', () => {
    const props = { loan: { userFormsDisabled: true } };
    const toggles = component(props).find(Toggle);
    expect(toggles.first().prop('toggled')).to.equal(true);
  });

  it('passes a disable function', () => {
    const onToggle = component(completeProps)
      .find(Toggle)
      .prop('onToggle');

    expect(onToggle).to.be.a('function');
  });

  it('disables the user forms when toggled on', () => {
    const toggledOffProps = {
      loan: { _id: '1234', userFormsDisabled: false },
      labelTop: 'top',
      labelLeft: 'left',
      labelRight: 'right',
    };
    const onToggle = component(toggledOffProps)
      .find(Toggle)
      .prop('onToggle');

    sinon.stub(loanUpdate, 'run');
    onToggle(null, true);

    expect(loanUpdate.run.getCall(0).args).to.deep.equal([
      {
        object: { userFormsDisabled: true },
        loanId: '1234',
      },
    ]);

    loanUpdate.run.restore();
  });

  it('enables the user forms when toggled off', () => {
    const toggledOnProps = {
      loan: { _id: '1234', userFormsDisabled: true },
      labelTop: 'top',
      labelLeft: 'left',
      labelRight: 'right',
    };
    const onToggle = component(toggledOnProps)
      .find(Toggle)
      .prop('onToggle');

    sinon.stub(loanUpdate, 'run');
    onToggle(null, false);

    expect(loanUpdate.run.getCall(0).args).to.deep.equal([
      {
        object: { userFormsDisabled: false },
        loanId: '1234',
      },
    ]);

    loanUpdate.run.restore();
  });
});
