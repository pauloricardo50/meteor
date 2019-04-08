// @flow
import React from 'react';
import ButtonBase from '@material-ui/core/ButtonBase';

import T from 'core/components/Translation';
import DialogSimple from 'core/components/DialogSimple';
import { toMoney } from 'core/utils/conversionFunctions';
import MaxPropertyValueContainer from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import { RESIDENCE_TYPE } from 'core/api/constants';
import { SimpleMaxPropertyValue } from '../../../components/SimpleMaxPropertyValue/SimpleMaxPropertyValue';

type SimpleBorrowersPageMaxPropertyValueStickyProps = {};

const getFooter = (maxPropertyValue, residenceType) => {
  if (!maxPropertyValue) {
    return <h2>Calculer</h2>;
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
    loan: { maxPropertyValue },
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
          {getFooter(maxPropertyValue, residenceType)}
        </ButtonBase>
      )}
      closeOnly
    >
      <SimpleMaxPropertyValue {...props} />
    </DialogSimple>
  );
};

export default MaxPropertyValueContainer(SimpleBorrowersPageMaxPropertyValueSticky);
