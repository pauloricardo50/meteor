import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'classnames';
import { compose } from 'recompose';

import { RESIDENCE_TYPE } from 'core/api/properties/propertyConstants';
import DialogSimple from 'core/components/DialogSimple';
import MaxPropertyValueContainer from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';
import { toMoney } from 'core/utils/conversionFunctions';

import { SimpleMaxPropertyValue } from './SimpleMaxPropertyValue';

const displayPropertyValueRange = values => {
  const { min, max } = values;

  if (min) {
    return `${toMoney(min.propertyValue)} - ${toMoney(max.propertyValue)}`;
  }

  return toMoney(max.propertyValue);
};

const getFooter = ({
  maxPropertyValue,
  residenceType,
  maxPropertyValueExists,
  canCalculateSolvency,
}) => {
  if (maxPropertyValueExists) {
    return <h2>Votre capacité d'achat</h2>;
  }

  if (!maxPropertyValue && !canCalculateSolvency) {
    return <h2>Renseignez vos revenus et fortune</h2>;
  }

  if (!maxPropertyValue && canCalculateSolvency) {
    return <h2 className="animated bounceIn calculate">Calculer</h2>;
  }

  const { canton } = maxPropertyValue;
  const values =
    residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
      ? maxPropertyValue.main
      : maxPropertyValue.second;

  return (
    <div className="sticky-result">
      <label>
        Capacité d'achat - <T id={`Forms.canton.${canton}`} /> -{' '}
        <T id={`Forms.residenceType.${residenceType}`} />
      </label>
      <h3>{displayPropertyValueRange(values)}</h3>
    </div>
  );
};

const SimpleMaxPropertyValueSticky = props => {
  const {
    loan: { maxPropertyValue, borrowers, maxPropertyValueExists },
    residenceType,
  } = props;
  const canCalculateSolvency = Calculator.canCalculateSolvency({ borrowers });
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
