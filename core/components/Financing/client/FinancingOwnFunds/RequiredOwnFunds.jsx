// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/pro-light-svg-icons/faMagic';

import { SUCCESS, ERROR } from '../../../../api/constants';
import StatusIcon from '../../../StatusIcon';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import { OWN_FUNDS_ROUNDING_AMOUNT } from '../../../../config/financeConstants';
import { CalculatedValue } from '../FinancingSection';
import IconButton from '../../../IconButton';
import StructureUpdateContainer from '../containers/StructureUpdateContainer';
import Calculator from '../../../../utils/Calculator';

type RequiredOwnFundsProps = {};

const getLabel = (value) => {
  if (value > OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.low';
  }
  if (value < -OWN_FUNDS_ROUNDING_AMOUNT) {
    return 'Financing.requiredOwnFunds.high';
  }

  return 'Financing.requiredOwnFunds.valid';
};

export const RequiredOwnFundsBody = ({ value, suggestStructure }) => {
  console.log('value', value);

  return (
    <div className="requiredOwnFunds-component-body">
      <div className="text-and-value">
        <span className="text">
          <T id={getLabel(value)} />
        </span>
        <div className="value">
          <span className="chf">CHF</span>
          {toMoney(value)}
          <StatusIcon
            status={getLabel(value).endsWith('valid') ? SUCCESS : ERROR}
            style={{ marginLeft: 8 }}
          />
        </div>
      </div>
      <IconButton
        type={<FontAwesomeIcon icon={faMagic} />}
        onClick={suggestStructure}
        tooltip="Suggérer"
      />
    </div>
  );
};

const RequiredOwnFunds = (props: RequiredOwnFundsProps) => {
  const { updateStructure, loan, structureId, calculateValue } = props;
  console.log('calculateValue:', calculateValue);
  return (
    <CalculatedValue
      {...props}
      value={calculateValue}
      className="requiredOwnFunds requiredOwnFunds-component"
    >
      {value => (
        <RequiredOwnFundsBody
          value={value}
          suggestStructure={() => {
            const ownFunds = Calculator.suggestStructureForLoan({
              loan,
              structureId,
            });
            updateStructure({ ownFunds });
          }}
        />
      )}
    </CalculatedValue>
  );
};

export default StructureUpdateContainer(RequiredOwnFunds);
