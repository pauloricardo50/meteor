/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'core/utils/testHelpers/enzyme';
import sinon from 'sinon';

import T from '../../../../../Translation';
import { CurrentOwnFunds } from '../CurrentOwnFunds';
import { OWN_FUNDS_TYPES } from '../../../../../../api/constants';

describe('CurrentOwnFunds', () => {
  let props;
  const component = () => shallow(<CurrentOwnFunds {...props} />);

  beforeEach(() => {
    props = {
      ownFunds: {
        value: 10,
        type: OWN_FUNDS_TYPES.BANK_FORTUNE,
        borrowerId: 'id',
      },
      borrowers: [{ bankFortune: [{ value: 100 }], _id: 'id' }],
      structure: { ownFunds: [] },
    };
  });

  it('displays usageType only if it is defined', () => {
    const usageType = 'some type';
    expect(component().find(T).length).to.equal(1);

    props.ownFunds = { usageType };

    expect(
      component()
        .find(T)
        .at(1)
        .props().id,
    ).to.include(usageType);
  });

  it('does not display firstName if there is only one', () => {
    props.borrowers = [{ firstName: 'joe' }];
    props.ownFunds = { borrowerId: 'id1' };
    expect(component().contains('joe')).to.equal(false);
  });

  it('displays firstName if there are multiple', () => {
    props.borrowers = [{ firstName: 'joe', _id: 'id1' }, {}];
    props.ownFunds = { borrowerId: 'id1' };
    expect(component().contains('joe')).to.equal(true);
  });

  it('opens modal if root div is clicked', () => {
    const spy = sinon.spy();
    props.handleOpen = spy;

    component()
      .find('div')
      .simulate('click');
    expect(spy.calledOnce).to.equal(true);
  });

  it('displays an error message if funds have changed to be lower than used', () => {
    props.borrowers = [
      { firstName: 'joe', _id: 'id1', bankFortune: [{ value: 20 }] },
    ];
    props.ownFunds = [
      {
        borrowerId: 'id1',
        value: 100000,
        type: OWN_FUNDS_TYPES.BANK_FORTUNE,
      },
    ];
    props.structure = { ownFunds: [props.ownFunds] };
    expect(
      component()
        .find('p.error')
        .exists(),
    ).to.equal(true);
  });

  it('displays an error message if funds have changed to be lower than used', () => {
    props.borrowers = [
      { firstName: 'joe', _id: 'id1', bankFortune: [{ value: 150 }] },
    ];
    props.ownFunds = {
      borrowerId: 'id1',
      value: 80,
      type: OWN_FUNDS_TYPES.BANK_FORTUNE,
    };
    props.structure = {
      ownFunds: [
        props.ownFunds,
        {
          borrowerId: 'id1',
          value: 80,
          type: OWN_FUNDS_TYPES.BANK_FORTUNE,
        },
      ],
    };
    expect(
      component()
        .find('p.error')
        .exists(),
    ).to.equal(true);
  });
});
