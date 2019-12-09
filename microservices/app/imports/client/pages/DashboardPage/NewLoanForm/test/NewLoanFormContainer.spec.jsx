// @flow
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'core/utils/testHelpers/enzyme';
import sinon from 'sinon';
import { loanUpdate, borrowerUpdate, propertyUpdate } from 'core/api';

import NewLoanFormContainer, { STEPS_ARRAY } from '../NewLoanFormContainer';

describe('NewLoanFormContainer', () => {
  let props = {};
  const EmptyComponent = () => null;
  const WithContainer = NewLoanFormContainer(props => (
    <EmptyComponent {...props} />
  ));
  const root = () => mount(<WithContainer {...props} />);
  const component = () => root().find(EmptyComponent);

  beforeEach(() => {
    props = {};

    sinon.stub(loanUpdate, 'run').callsFake(({ object: { name }, loanId }) => {
      if (!!loanId && !!name) {
        return Promise.resolve();
      }
      throw new Error('No name or loanId');
    });

    sinon
      .stub(borrowerUpdate, 'run')
      .callsFake(({ object: { salary, bankFortune }, borrowerId }) => {
        if (!!salary && !!bankFortune && !!borrowerId) {
          return Promise.resolve();
        }

        throw new Error('No salary, bankFortune or borrowerId');
      });

    sinon
      .stub(propertyUpdate, 'run')
      .callsFake(({ object: { value }, propertyId }) => {
        if (!!value && !!propertyId) {
          return Promise.resolve();
        }

        throw new Error('No value or propertyId');
      });
  });

  afterEach(() => {
    loanUpdate.run.restore();
    borrowerUpdate.run.restore();
    propertyUpdate.run.restore();
  });

  it('should open if the conditions are met', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    expect(component().props())
      .to.have.property('open')
      .to.equal(true);
  });

  it('should not open if all data has been provided', () => {
    props.loan = {
      name: 'test',
      properties: [{ value: 100 }],
      borrowers: [{ salary: 100, bankFortune: [{ value: 100 }] }],
    };

    expect(component().props())
      .to.have.property('open')
      .to.equal(false);
  });

  it('should close', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    child()
      .props()
      .handleCloseDialog();

    wrapper.update();

    expect(child().props().open).to.equal(false);
  });

  it('increments step', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    child()
      .props()
      .handleNext({ preventDefault: () => null });

    wrapper.update();

    expect(child().props().step).to.equal(1);
  });

  it('does not increment step when it is the last step', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    STEPS_ARRAY.forEach(() => {
      child()
        .props()
        .handleNext({ preventDefault: () => null });
      wrapper.update();
    });

    expect(child().props().step).to.equal(STEPS_ARRAY.length - 1);
  });

  it('decrements step', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    // Go to last step
    STEPS_ARRAY.forEach(() => {
      child()
        .props()
        .handleNext({ preventDefault: () => null });
      wrapper.update();
    });

    // Decrement step
    child()
      .props()
      .handlePrevious({ preventDefault: () => null });

    wrapper.update();

    expect(child().props().step).to.equal(STEPS_ARRAY.length - 2);
  });

  it('does not decrement step when it is the first step', () => {
    props.loan = {
      name: '',
      properties: [{}],
      borrowers: [{}],
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    child()
      .props()
      .handlePrevious({ preventDefault: () => null });

    wrapper.update();

    expect(child().props().step).to.equal(0);
  });

  context('onSubmit should throw when', () => {
    it('no name or loan id is provided', () => {
      expect(() => loanUpdate.run({ object: { name: '' } })).to.throw(
        'No name or loanId',
      );
    });

    it('no salary, bank fortune or borrower id is provided', () => {
      expect(() =>
        borrowerUpdate.run({
          object: { salary: null, bankFortune: null },
          borrowerId: '',
        }),
      ).to.throw('No salary, bankFortune or borrowerId');
    });

    it('no value or property id is provided', () => {
      expect(() =>
        propertyUpdate.run({
          object: { value: null },
          propertyId: '',
        }),
      ).to.throw('No value or propertyId');
    });
  });

  it('should submit and close the form', () => {
    props = {
      loan: {
        _id: 'id',
        name: 'loanName',
        properties: [{ _id: 'propertyId', value: 100 }],
        borrowers: [{ _id: 'borrowerId', salary: 10, bankFortune: 10 }],
      },
    };

    const wrapper = root();
    const child = () => wrapper.find(EmptyComponent);

    child()
      .props()
      .handleSubmit({ preventDefault: () => null });

    wrapper.update();

    expect(child().props().open).to.equal(false);
  });
});
