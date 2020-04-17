import React from 'react';
import { compose, withProps, withState } from 'recompose';

import { CANTONS } from '../../api/loans/loanConstants';
import { setMaxPropertyValueOrBorrowRatio } from '../../api/loans/methodDefinitions';
import {
  PROPERTY_CATEGORY,
  RESIDENCE_TYPE,
} from '../../api/properties/propertyConstants';
import Calculator from '../../utils/Calculator';
import T from '../Translation';

export const STATE = {
  MISSING_INFOS: 'MISSING_INFOS',
  EMPTY: 'EMPTY',
  DONE: 'DONE',
};

const getState = ({ loan }) => {
  const { maxPropertyValue, maxPropertyValueExists } = loan;
  if (!Calculator.canCalculateSolvency({ loan })) {
    return STATE.MISSING_INFOS;
  }

  if (!maxPropertyValue && !maxPropertyValueExists) {
    return STATE.EMPTY;
  }

  return STATE.DONE;
};

const getInitialCanton = ({ loan = {} }) => {
  const {
    maxPropertyValue: { canton } = {},
    hasPromotion,
    hasProProperty,
    promotions = [],
    properties = [],
  } = loan;

  if (hasPromotion) {
    return !!promotions.length && promotions[0].canton;
  }

  if (hasProProperty) {
    return !!properties.length && properties[0].canton;
  }

  return canton;
};

const shouldFilterCantonOptions = ({
  hasPromotion,
  hasProProperty,
  properties = [],
}) => {
  if (!hasPromotion && !hasProProperty) {
    return false;
  }

  if (hasPromotion) {
    return true;
  }

  if (hasProProperty) {
    const proProperties = properties.filter(
      ({ category }) => category === PROPERTY_CATEGORY.PRO,
    );
    // Don't filter canton options if there exists at least one user property
    return proProperties.length === properties.length;
  }
};

const getCantonOptions = ({
  hasPromotion,
  hasProProperty,
  properties = [],
  promotions = [],
}) => {
  let cantons = Object.keys(CANTONS);

  if (
    shouldFilterCantonOptions({
      hasPromotion,
      hasProProperty,
      properties,
      promotions,
    })
  ) {
    if (hasPromotion) {
      cantons = cantons.filter(canton => canton === promotions[0].canton);
    }

    if (hasProProperty) {
      cantons = cantons.filter(canton =>
        properties
          .map(({ canton: proPropertyCanton }) => proPropertyCanton)
          .includes(canton),
      );
    }
  }

  return cantons.map(shortCanton => {
    const canton = CANTONS[shortCanton];
    return { id: shortCanton, label: canton };
  });
};

export default compose(
  withState(
    'residenceType',
    'setResidenceType',
    ({ loan: { residenceType } }) =>
      residenceType || RESIDENCE_TYPE.MAIN_RESIDENCE,
  ),
  withState('canton', 'setCanton', getInitialCanton),
  withState('loading', 'setLoading', null),
  withState('error', 'setError', null),
  withProps(
    ({
      loan,
      setLoading,
      setCanton,
      canton,
      setOpenBorrowersForm,
      setError,
    }) => {
      const {
        _id: loanId,
        maxPropertyValue,
        hasPromotion,
        hasProProperty,
        properties,
        promotions,
      } = loan;

      return {
        state: getState({ loan }),
        recalculate: () => {
          if (!canton) {
            setError(<T id="MaxPropertyValue.noCantonError" />);
            return;
          }
          setLoading(true);
          if (setOpenBorrowersForm) {
            setOpenBorrowersForm(false);
          }
          return setMaxPropertyValueOrBorrowRatio
            .run({ canton, loanId })
            .finally(() => {
              setLoading(false);
            });
        },
        onChangeCanton: newCanton => {
          setCanton(newCanton);
          setError(undefined);
          const { canton: existingCanton } = maxPropertyValue || {};

          if (existingCanton && newCanton !== existingCanton) {
            setLoading(true);
            return setMaxPropertyValueOrBorrowRatio
              .run({ canton: newCanton, loanId })
              .finally(() => setLoading(false));
          }
        },
        cantonOptions: getCantonOptions({
          hasPromotion,
          hasProProperty,
          properties,
          promotions,
        }),
        lockCanton:
          getCantonOptions({
            hasPromotion,
            hasProProperty,
            properties,
            promotions,
          }).length === 1,
      };
    },
  ),
);
