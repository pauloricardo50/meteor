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
import { SimpleMaxPropertyValue } from '../../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValue';

type SimpleBorrowersPageMaxPropertyValueStickyProps = {};

const getFooter = ({ maxPropertyValue, residenceType, borrowers = [] }) => {
  const canCalculateSolvency = Calculator.canCalculateSolvency({ borrowers });
  if (!maxPropertyValue && !canCalculateSolvency) {
    return <h2>Renseignez vos revenus et fortune</h2>;
  }

  if (!maxPropertyValue && canCalculateSolvency) {
    return <h2 className="animated bounceIn">Calculer</h2>;
  }

  const { canton } = maxPropertyValue;
  const values = residenceType === RESIDENCE_TYPE.MAIN_RESIDENCE
    ? maxPropertyValue.main
    : maxPropertyValue.second;

  return (
    <div>
      <label>
        Capacité d'achat - <T id={`Forms.canton.${canton}`} /> -{' '}
        <T id={`Forms.residenceType.${residenceType}`} />
      </label>
      <h3>
        {toMoney(values.min.propertyValue)}&nbsp;-&nbsp;
        {toMoney(values.max.propertyValue)}
      </h3>
    </div>
  );
};

const SimpleBorrowersPageMaxPropertyValueSticky = (props: SimpleBorrowersPageMaxPropertyValueStickyProps) => {
  const {
    loan: { maxPropertyValue, borrowers },
    residenceType,
  } = props;

  return (
    <DialogSimple
      renderTrigger={({ handleOpen }) => (
        <ButtonBase
          focusRipple
          className="simple-borrowers-page-max-property-value-sticky animated slideInUp"
          onClick={handleOpen}
        >
          {getFooter({ maxPropertyValue, residenceType, borrowers })}
        </ButtonBase>
      )}
      closeOnly
      PaperProps={{ style: { margin: 0 } }}
    >
      <SimpleMaxPropertyValue {...props} />
    </DialogSimple>
  );
};

export default compose(MaxPropertyValueContainer)(SimpleBorrowersPageMaxPropertyValueSticky);
