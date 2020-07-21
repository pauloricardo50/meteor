import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'classnames';

import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import T from 'core/components/Translation/FormattedMessage';

import { ACTIONS, PURCHASE_TYPE, SALARY } from './wwwCalculatorConstants';
import { useWwwCalculator } from './WwwCalculatorState';

const purchaseTypes = Object.values(PURCHASE_TYPE);

const icons = {
  [PURCHASE_TYPE.ACQUISITION]: <AcquisitionIcon />,
  [PURCHASE_TYPE.REFINANCING]: <RefinancingIcon />,
};

const WwwCalculatorPurchaseType = () => {
  const [{ purchaseType, salary }, dispatch] = useWwwCalculator();
  return (
    <div className="www-calculator-purchase-type">
      {purchaseTypes.map(type => (
        <ButtonBase
          key={type}
          className={cx({ active: type === purchaseType })}
          onClick={() => {
            dispatch({
              type: ACTIONS.SET,
              payload: { purchaseType: type },
            });

            if (type === PURCHASE_TYPE.REFINANCING && salary.value > 0) {
              dispatch({
                type: ACTIONS.SET_AT,
                payload: { isAuto: false, at: SALARY },
              });
            }
          }}
        >
          {icons[type]}
          <div className="button-text">
            <T id={`WwwCalculatorPurchaseType.${type}`} />
          </div>
        </ButtonBase>
      ))}
    </div>
  );
};

export default WwwCalculatorPurchaseType;
