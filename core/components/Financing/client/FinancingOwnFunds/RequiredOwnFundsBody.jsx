// @flow
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic } from '@fortawesome/pro-light-svg-icons/faMagic';

import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import IconButton from '../../../IconButton';
import { getLabel } from './financingOwnFundsHelpers';
import FinancingOwnFundsStatus from './FinancingOwnFundsStatus';

type RequiredOwnFundsBodyProps = {};

const RequiredOwnFundsBody = (props: RequiredOwnFundsBodyProps) => {
  const {
    value,
    suggestStructure,
    disableForms,
    loan = {},
    structureId,
  } = props;

  const label = getLabel(value);
  const { borrowers = [] } = loan;
  return (
    <div className="requiredOwnFunds-component-body">
      <div className="text-and-value">
        <span className="text">
          <T id={label} />
        </span>
        <div className="value">
          <span className="chf">CHF</span>
          {toMoney(Math.abs(value))}
          <FinancingOwnFundsStatus {...props} />
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
