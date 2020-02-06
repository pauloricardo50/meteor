import React from 'react';

import { OWN_FUNDS_USAGE_TYPES, OWN_FUNDS_TYPES } from 'core/api/constants';
import Icon from 'core/components/Icon';
import { MIN_INSURANCE2_WITHDRAW } from 'core/config/financeConstants';
import { toMoney } from 'core/utils/conversionFunctions';
import T from '../../../../Translation';

const FinancingOwnFundsWithdrawWarning = ({ usageType, type, value }) => {
  // Withdrawals of LPP and 3A are taxable
  const isWithdrawTaxable =
    usageType === OWN_FUNDS_USAGE_TYPES.WITHDRAW &&
    [
      OWN_FUNDS_TYPES.INSURANCE_2,
      OWN_FUNDS_TYPES.INSURANCE_3A,
      OWN_FUNDS_TYPES.BANK_3A,
    ].includes(type);

  const isInsurance2WithdrawTooLow =
    type === OWN_FUNDS_TYPES.INSURANCE_2 && value < MIN_INSURANCE2_WITHDRAW;

  if (isWithdrawTaxable) {
    return (
      <p className="financing-withdraw-warning primary">
        <Icon type="info" className="icon" />
        {isInsurance2WithdrawTooLow ? (
          <T
            id="FinancingOwnFundsWithdrawWarning.insurance2"
            values={{
              minWithdraw: (
                <b style={{ color: 'black' }}>
                  &nbsp;
                  {toMoney(MIN_INSURANCE2_WITHDRAW)}
                  &nbsp;
                </b>
              ),
            }}
          />
        ) : (
          <T id="FinancingOwnFundsWithdrawWarning.description" />
        )}
      </p>
    );
  }

  return null;
};

export default FinancingOwnFundsWithdrawWarning;
