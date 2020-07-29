import React from 'react';

import Icon from 'core/components/Icon';

import Button from '../../Button';
import {
  ACQUISITION_FIELDS,
  ACTIONS,
  CURRENT_LOAN,
  FORTUNE,
  PROPERTY,
  PURCHASE_TYPE,
  REFINANCING_FIELDS,
  SALARY,
  WANTED_LOAN,
} from '../wwwCalculatorConstants';
import { useWwwCalculator } from '../WwwCalculatorState';
import WwwCalculatorFormField from './WwwCalculatorFormField';

const hasError = (purchaseType, field, statusMessageId) => {
  if (!statusMessageId) {
    return false;
  }

  if (statusMessageId?.includes('income') && field === SALARY) {
    return true;
  }
  if (
    purchaseType === PURCHASE_TYPE.ACQUISITION &&
    statusMessageId.includes('borrow') &&
    field === FORTUNE
  ) {
    return true;
  }
  if (
    purchaseType === PURCHASE_TYPE.REFINANCING &&
    statusMessageId.includes('borrow') &&
    field === WANTED_LOAN
  ) {
    return true;
  }
};

const WwwCalculatorForm = () => {
  const [
    { purchaseType, statusMessageId, ...state },
    dispatch,
  ] = useWwwCalculator();
  const fields =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS;

  return (
    <div className="www-calculator-form">
      <div className="www-calculator-form-fields">
        {fields.map(field => (
          <WwwCalculatorFormField
            key={field}
            field={field}
            error={hasError(purchaseType, field, statusMessageId)}
          />
        ))}
      </div>

      <Button
        primary
        fullWidth
        icon={<Icon type="backupRestore" />}
        onClick={() =>
          dispatch({
            type: ACTIONS.SET,
            payload: {
              [SALARY]: { ...state[SALARY], value: 0, isAuto: true },
              [FORTUNE]: { ...state[FORTUNE], value: 0, isAuto: true },
              [PROPERTY]: { ...state[PROPERTY], value: 0, isAuto: true },
              [CURRENT_LOAN]: {
                ...state[CURRENT_LOAN],
                value: 0,
                isAuto: true,
              },
              [WANTED_LOAN]: { ...state[WANTED_LOAN], value: 0, isAuto: true },
            },
          })
        }
        style={{ maxWidth: 400, alignSelf: 'center' }}
      >
        Remettre à zéro
      </Button>
    </div>
  );
};

export default WwwCalculatorForm;
