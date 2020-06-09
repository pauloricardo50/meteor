/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Sinon from 'sinon';

import {
  PROMOTION_OPTION_AGREEMENT_STATUS,
  PROMOTION_OPTION_BANK_STATUS,
  PROMOTION_OPTION_DEPOSIT_STATUS,
  PROMOTION_OPTION_FULL_VERIFICATION_STATUS,
  PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS,
} from '../../../../../api/promotionOptions/promotionOptionConstants';
import {
  cleanup,
  fireEvent,
  render,
} from '../../../../../utils/testHelpers/testing-library';
import PromotionReservationProgress from '../..';

describe('PromotionReservationProgress', () => {
  let promotionOption;
  beforeEach(() => {
    promotionOption = {
      bank: { status: PROMOTION_OPTION_BANK_STATUS.INCOMPLETE },
      simpleVerification: {
        status: PROMOTION_OPTION_SIMPLE_VERIFICATION_STATUS.INCOMPLETE,
      },
      fullVerification: {
        status: PROMOTION_OPTION_FULL_VERIFICATION_STATUS.INCOMPLETE,
      },
      reservationAgreement: {
        status: PROMOTION_OPTION_AGREEMENT_STATUS.WAITING,
      },
      reservationDeposit: {
        status: PROMOTION_OPTION_DEPOSIT_STATUS.WAITING,
      },
    };
    return cleanup();
  });

  it('shows all steps', () => {
    const { getAllByTestId } = render(
      <PromotionReservationProgress
        promotionOption={promotionOption}
        loan={{}}
        showLoanProgress
      />,
    );

    expect(getAllByTestId('step').length).to.equal(8);
  });

  it('hides loanProgress steps', () => {
    const { getAllByTestId } = render(
      <PromotionReservationProgress
        promotionOption={promotionOption}
        loan={{}}
      />,
    );

    expect(getAllByTestId('step').length).to.equal(6);
  });

  it('shows labels', () => {
    const { queryByText, rerender } = render(
      <PromotionReservationProgress
        promotionOption={promotionOption}
        loan={{}}
      />,
    );

    expect(!!queryByText('Accord de principe')).to.equal(false);

    rerender(
      <PromotionReservationProgress
        promotionOption={promotionOption}
        loan={{}}
        showLabels
      />,
    );

    expect(!!queryByText('Accord de principe')).to.equal(true);
  });

  it('some steps are clickable if onClick is passed', () => {
    const onClick = Sinon.spy();

    const { getAllByTestId } = render(
      <PromotionReservationProgress
        promotionOption={promotionOption}
        loan={{}}
        onClick={onClick}
        showLoanProgress
      />,
    );

    const [simpleVerification, info] = getAllByTestId('step');

    fireEvent.click(simpleVerification);
    fireEvent.click(info);

    expect(onClick.callCount).to.equal(1);
    expect(onClick.firstCall.args).to.deep.equal(['simpleVerification']);
  });
});
