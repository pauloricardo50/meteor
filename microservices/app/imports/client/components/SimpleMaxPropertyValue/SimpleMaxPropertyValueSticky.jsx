import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'classnames';
import { compose } from 'recompose';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import DialogSimple from 'core/components/DialogSimple';
import MaxPropertyValueContainer from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import { SimpleMaxPropertyValue } from './SimpleMaxPropertyValue';

const displayRange = (values, purchaseType) => {
  const { min, max } = values;
  let minVal;
  let maxVal;

  if (purchaseType === PURCHASE_TYPE.ACQUISITION) {
    minVal = min?.propertyValue;
    maxVal = max?.propertyValue;
  }

  if (purchaseType === PURCHASE_TYPE.REFINANCING) {
    minVal = min?.propertyValue * min?.borrowRatio;
    maxVal = max?.propertyValue * max?.borrowRatio;
  }

  if (min) {
    return `${toMoney(minVal)} - ${toMoney(maxVal)}`;
  }

  return toMoney(maxVal);
};

const getFooter = ({
  maxPropertyValue,
  residenceType,
  maxPropertyValueExists,
  canCalculateSolvency,
  purchaseType,
}) => {
  if (maxPropertyValueExists) {
    return (
      <div className="font-size-3">
        <T id="MaxPropertyValue.stickyFooterTitle" />
      </div>
    );
  }

  if (!maxPropertyValue && !canCalculateSolvency) {
    return (
      <div className="font-size-3">
        <T id="MaxPropertyValue.stickyFooterEmpty" />
      </div>
    );
  }

  if (!maxPropertyValue && canCalculateSolvency) {
    return (
      <div className="animated bounceIn calculate font-size-3">
        <T id="MaxPropertyValue.stickyFooterCalculate" />
      </div>
    );
  }

  const { canton } = maxPropertyValue;
  const values =
    residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
      ? maxPropertyValue.main
      : maxPropertyValue.second;

  return (
    <div className="sticky-result">
      <label>
        <T id="MaxPropertyValue.title" values={{ purchaseType }} /> -{' '}
        <T id={`Forms.canton.${canton}`} /> -{' '}
        <T id={`Forms.residenceType.${residenceType}`} />
      </label>
      <div className="font-size-3">{displayRange(values, purchaseType)}</div>
    </div>
  );
};

const SimpleMaxPropertyValueSticky = props => {
  const { loan, residenceType } = props;
  const { maxPropertyValue, maxPropertyValueExists, purchaseType } = loan;
  const canCalculateSolvency = Calculator.canCalculateSolvency({ loan });
  const shouldCalculate = !maxPropertyValue && canCalculateSolvency;

  return (
    <DialogSimple
      renderTrigger={({ handleOpen }) => (
        <ButtonBase
          focusRipple
          className={cx('max-property-value-sticky animated slideInUp', {
            success: shouldCalculate,
          })}
          onClick={handleOpen}
        >
          {getFooter({
            maxPropertyValue,
            residenceType,
            maxPropertyValueExists,
            canCalculateSolvency,
            purchaseType,
          })}
        </ButtonBase>
      )}
      closeOnly
      PaperProps={{ style: { margin: 0 } }}
    >
      <SimpleMaxPropertyValue {...props} noPadding />
    </DialogSimple>
  );
};

export default compose(MaxPropertyValueContainer)(SimpleMaxPropertyValueSticky);
