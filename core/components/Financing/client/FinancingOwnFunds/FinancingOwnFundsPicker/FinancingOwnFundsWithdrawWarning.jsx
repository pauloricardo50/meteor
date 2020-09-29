import React from 'react';

import { OWN_FUNDS_TYPES } from '../../../../../api/borrowers/borrowerConstants';
import { OWN_FUNDS_USAGE_TYPES } from '../../../../../api/loans/loanConstants';
import { MIN_INSURANCE2_WITHDRAW } from '../../../../../config/financeConstants';
import { toMoney } from '../../../../../utils/conversionFunctions';
import Icon from '../../../../Icon';
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
            values={{
              minWithdraw: (
                <b style={{ color: 'black' }}>
                  &nbsp;
                  {toMoney(MIN_INSURANCE2_WITHDRAW)}
                  &nbsp;
                </b>
              ),
            }}
            defaultMessage="Attention, vous devez retirer au minimum CHF {minWithdraw} de LPP"
          />
        ) : (
          <T defaultMessage="Attention, lors des retraits de capitaux de prévoyance (LPP, 3A), vous serez imposé sur l'ensemble des retraits cumulés. Pensez à prévoir des fonds propres supplémentaires pour payer cet impôt." />
        )}
      </p>
    );
  }

  return null;
};

export default FinancingOwnFundsWithdrawWarning;
