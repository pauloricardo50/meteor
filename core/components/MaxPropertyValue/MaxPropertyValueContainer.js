import { withProps, compose, withState } from 'recompose';

import { setMaxPropertyValueWithoutBorrowRatio } from 'core/api/methods';
import Calculator from 'core/utils/Calculator';
import { RESIDENCE_TYPE, PROPERTY_CATEGORY, CANTONS } from 'core/api/constants';

export const STATE = {
  MISSING_INFOS: 'MISSING_INFOS',
  EMPTY: 'EMPTY',
  DONE: 'DONE',
};

const getState = ({ borrowers, maxPropertyValue, maxPropertyValueExists }) => {
  if (!Calculator.canCalculateSolvency({ borrowers })) {
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
    return properties.length === 1 ? properties[0].canton : '';
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
    const proProperties = properties.filter(({ category }) => category === PROPERTY_CATEGORY.PRO);
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
          .includes(canton));
    }
  }

  return cantons.map((shortCanton) => {
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
  withProps(({
    loan: {
      _id: loanId,
      borrowers = [],
      maxPropertyValue,
      maxPropertyValueExists,
      hasPromotion,
      hasProProperty,
      properties,
      promotions,
    },
    setLoading,
    setCanton,
    canton,
  }) => ({
    state: getState({ borrowers, maxPropertyValue, maxPropertyValueExists }),
    recalculate: () => {
      setLoading(true);
      return setMaxPropertyValueWithoutBorrowRatio
        .run({ canton, loanId })
        .finally(() => setLoading(false));
    },
    onChangeCanton: (_, newCanton) => {
      console.log('newCanton:', newCanton);
      setCanton(newCanton);
      const { canton: existingCanton } = maxPropertyValue || {};

      if (existingCanton && newCanton !== existingCanton) {
        setLoading(true);
        return setMaxPropertyValueWithoutBorrowRatio
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
  })),
);
