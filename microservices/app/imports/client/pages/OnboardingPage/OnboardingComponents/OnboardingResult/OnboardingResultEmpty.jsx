import React, { useState } from 'react';

import { setMaxPropertyValueOrBorrowRatio } from 'core/api/loans/methodDefinitions';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

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

const OnboardingResultEmpty = () => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const { loan } = useOnboarding();
  const canton = getCanton(loan);

  return (
    <div className="animated fadeIn">
      <h1>
        <T id="OnboardingResultEmpty.title" />
      </h1>
      <p className="secondary">
        <T id="OnboardingResultEmpty.description" />
      </p>

      <Button
        size="large"
        raised
        secondary
        onClick={() => {
          setLoading(true);
          setError(null);
          setMaxPropertyValueOrBorrowRatio
            .run({ canton, loanId: loan._id })
            .then(() => {
              // Keep loading forever if it succeeds, the UI transition will
              // happen on its own
            })
            .catch(err => {
              setError(err);
              setLoading(false);
            });
        }}
        loading={loading}
        icon={<Icon type="check" />}
      >
        <T id="OnboardingResultEmpty.cta" />
      </Button>
    </div>
  );
};

export default OnboardingResultEmpty;
