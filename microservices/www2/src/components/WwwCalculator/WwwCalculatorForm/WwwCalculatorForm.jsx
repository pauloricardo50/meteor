import React from 'react';

import Icon from 'core/components/Icon';

import Button from '../../Button';
import {
  ACQUISITION_FIELDS,
  PURCHASE_TYPE,
  REFINANCING_FIELDS,
} from '../wwwCalculatorConstants';
import { useWwwCalculator } from '../WwwCalculatorState';
import WwwCalculatorFormField from './WwwCalculatorFormField';

const WwwCalculatorForm = () => {
  const [{ purchaseType }] = useWwwCalculator();
  const fields =
    purchaseType === PURCHASE_TYPE.ACQUISITION
      ? ACQUISITION_FIELDS
      : REFINANCING_FIELDS;

  return (
    <div className="www-calculator-form card1">
      <div className="card-top">
        {fields.map(field => (
          <WwwCalculatorFormField key={field} field={field} />
        ))}
      </div>

      <div className="card-bottom">
        <Button fullWidth icon={<Icon type="backupRestore" />}>
          Remettre à zero
        </Button>
      </div>
    </div>
  );
};

export default WwwCalculatorForm;
