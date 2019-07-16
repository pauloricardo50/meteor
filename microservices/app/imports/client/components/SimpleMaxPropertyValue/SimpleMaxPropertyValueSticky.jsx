// @flow
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { compose } from 'recompose';

import T from 'core/components/Translation';
import DialogSimple from 'core/components/DialogSimple';
import { toMoney } from 'core/utils/conversionFunctions';
import MaxPropertyValueContainer from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { RESIDENCE_TYPE } from 'core/api/constants';
import Calculator from 'core/utils/Calculator';
import { SimpleMaxPropertyValue } from './SimpleMaxPropertyValue';

type SimpleMaxPropertyValueStickyProps = {};

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
  borrowers = [],
  maxPropertyValueExists,
}) => {
  const canCalculateSolvency = Calculator.canCalculateSolvency({ borrowers });

  if (maxPropertyValueExists) {
    return <h2>Votre capacité d'achat</h2>;
  }

  if (!maxPropertyValue && !canCalculateSolvency) {
    return <h2>Renseignez vos revenus et fortune</h2>;
  }

  if (!maxPropertyValue && canCalculateSolvency) {
    return <h2 className="animated bounceIn">Calculer</h2>;
  }

  const { canton } = maxPropertyValue;
  const values =
    residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
      ? maxPropertyValue.main
      : maxPropertyValue.second;

  return (
    <div>
      <label>
        Capacité d'achat - <T id={`Forms.canton.${canton}`} /> -{' '}
        <T id={`Forms.residenceType.${residenceType}`} />
      </label>
      <h3>{displayPropertyValueRange(values)}</h3>
    </div>
  );
};

const SimpleMaxPropertyValueSticky = (
  props: SimpleMaxPropertyValueStickyProps,
) => {
  const {
    loan: { maxPropertyValue, borrowers, maxPropertyValueExists },
    residenceType,
  } = props;

  return (
    <DialogSimple
      renderTrigger={({ handleOpen }) => (
        <ButtonBase
          focusRipple
          className="simple-max-property-value-sticky animated slideInUp"
          onClick={handleOpen}
        >
          {getFooter({
            maxPropertyValue,
            residenceType,
            borrowers,
            maxPropertyValueExists,
          })}
        </ButtonBase>
      )}
      closeOnly
      PaperProps={{ style: { margin: 0 } }}
    >
      <SimpleMaxPropertyValue {...props} />
    </DialogSimple>
  );
};

export default compose(MaxPropertyValueContainer)(SimpleMaxPropertyValueSticky);
