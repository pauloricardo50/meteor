import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'classnames';

import T from 'core/components/Translation/FormattedMessage';

import { ACTIONS, PURCHASE_TYPE } from './wwwCalculatorConstants';
import { useWwwCalculator } from './WwwCalculatorState';

const purchaseTypes = Object.values(PURCHASE_TYPE);

const WwwCalculatorPurchaseType = () => {
  const [{ purchaseType }, dispatch] = useWwwCalculator();
  return (
    <div className="www-calculator-purchase-type">
      {purchaseTypes.map(type => (
        <ButtonBase
          key={type}
          className={cx({ active: type === purchaseType })}
          onClick={() =>
            dispatch({
              type: ACTIONS.SET,
              payload: { purchaseType: type },
            })
          }
        >
          <h2>
            <T id={`WwwCalculatorPurchaseType.${type}`} />
          </h2>
        </ButtonBase>
      ))}
    </div>
  );
};

export default WwwCalculatorPurchaseType;
