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

const WwwCalculatorForm = () => {
  const [{ purchaseType, ...state }, dispatch] = useWwwCalculator();
  const fields =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS;

  return (
    <div className="www-calculator-form">
      <div className="www-calculator-form-fields">
        {fields.map(field => (
          <WwwCalculatorFormField key={field} field={field} />
        ))}
      </div>

      <Button
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
        Remettre à zero
      </Button>
    </div>
  );
};

export default WwwCalculatorForm;
