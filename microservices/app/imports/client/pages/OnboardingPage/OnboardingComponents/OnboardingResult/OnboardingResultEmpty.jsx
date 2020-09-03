import React, { useState } from 'react';
import { faCalculator } from '@fortawesome/pro-duotone-svg-icons/faCalculator';

import { setMaxPropertyValueOrBorrowRatio } from 'core/api/loans/methodDefinitions';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../../OnboardingContext';

const getCanton = loan => {
  if (loan.hasPromotion) {
    return loan.promotions?.[0]?.canton;
  }

  if (loan.hasProProperty) {
    // If you moved forward without a pro property, and later you attach one
    // to your loan, the calculation should be done for this new pro-property's canton
    // for the rest to make sense, as you can't go back and change your canton anymore
    return loan.properties.find(
      ({ category }) => category === PROPERTY_CATEGORY.PRO,
    ).canton;
  }

  return loan.properties[0]?.canton;
};

export const calculateMaxPropertyValue = loan =>
  setMaxPropertyValueOrBorrowRatio.run({
    canton: getCanton(loan),
    loanId: loan._id,
  });

const OnboardingResultEmpty = () => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const { loan } = useOnboarding();

  return (
    <div className="animated fadeIn">
      <FaIcon icon={faCalculator} size="3x" color={colors.duotoneIconColor} />

      <h1>
        <T id="OnboardingResultEmpty.title" />
      </h1>

      <p className="description secondary">
        <T id="OnboardingResultEmpty.description" />
      </p>

      <Button
        size="large"
        raised
        secondary
        onClick={() => {
          setLoading(true);
          setError(null);
          calculateMaxPropertyValue(loan).catch(err => {
            setError(err);
            setLoading(false);
          });
        }}
        loading={loading}
        icon={<Icon type="right" />}
        className="mt-40"
        iconAfter
      >
        <T id="OnboardingResultEmpty.cta" />
      </Button>
    </div>
  );
};

export default OnboardingResultEmpty;
