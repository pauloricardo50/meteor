// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/pro-light-svg-icons/faMagic';

import StatusIcon from '../../../StatusIcon';
import T, { Money } from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../config/financeConstants';
import { SUCCESS, ERROR } from '../../../../api/constants';
import IconButton from '../../../IconButton';

type RequiredOwnFundsBodyProps = {};

const getLabel = (value) => {
  if (value > OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.low';
  }
  if (value < -OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.high';
  }

  return 'Financing.requiredOwnFunds.valid';
};

const RequiredOwnFundsBody = ({
  value,
  suggestStructure,
  disableForms,
  loan = {}
}: RequiredOwnFundsBodyProps) => {
  const label = getLabel(value);
  const {borrowers= []} = loan;
  return (
    <div className="requiredOwnFunds-component-body">
      <div className="text-and-value">
        <span className="text">
          <T id={label} />
        </span>
        <div className="value">
          <span className="chf">CHF</span>
          {toMoney(Math.abs(value))}
          <StatusIcon
            status={label.endsWith('valid') ? SUCCESS : ERROR}
            style={{ marginLeft: 8 }}
            tooltip={(
              <T
                id={`${label}.tooltip`}
                values={{ value: <Money value={Math.abs(value)} /> }}
              />
            )}
          />
        </div>
      </div>
      {!disableForms && !!borrowers.length && (
        <IconButton
          type={<FontAwesomeIcon icon={faMagic} />}
          onClick={suggestStructure}
          tooltip="Suggérer"
        />
      )}
    </div>
  );
};

export default RequiredOwnFundsBody;
