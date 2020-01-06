// @flow
import React from 'react';

import { OWN_FUNDS_USAGE_TYPES, OWN_FUNDS_TYPES } from 'core/api/constants';
import Icon from 'core/components/Icon';
import T from '../../../../Translation';

type FinancingOwnFundsWithdrawWarningProps = {};

const FinancingOwnFundsWithdrawWarning = ({
  usageType,
  type,
  value,
}: FinancingOwnFundsWithdrawWarningProps) => {
  // Withdrawals of LPP and 3A are taxable
  const isWithdrawTaxable =
    usageType === OWN_FUNDS_USAGE_TYPES.WITHDRAW &&
    [
      OWN_FUNDS_TYPES.INSURANCE_2,
      OWN_FUNDS_TYPES.INSURANCE_3A,
      OWN_FUNDS_TYPES.BANK_3A,
    ].includes(type);

  const isInsurance2WithdrawTooLow =
    type === OWN_FUNDS_TYPES.INSURANCE_2 && value < 20000;

  if (isWithdrawTaxable) {
    return (
      <p className="financing-withdraw-warning primary">
        <Icon type="info" className="icon" />
        {isInsurance2WithdrawTooLow ? (
          <T id="FinancingOwnFundsWithdrawWarning.insurance2" />
        ) : (
          <T id="FinancingOwnFundsWithdrawWarning.description" />
        )}
      </p>
    );
  }

  return null;
};

export default FinancingOwnFundsWithdrawWarning;
