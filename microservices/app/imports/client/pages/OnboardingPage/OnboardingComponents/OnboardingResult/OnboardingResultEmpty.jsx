import React, { useState } from 'react';

import { setMaxPropertyValueOrBorrowRatio } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { useOnboarding } from '../../OnboardingContext';

const OnboardingResultEmpty = () => {
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const { loan } = useOnboarding();
  const canton = loan.properties?.[0]?.canton || loan.promotions?.[0]?.canton;

  return (
    <div className="animated fadeInUp">
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
      >
        <T id="OnboardingResultEmpty.cta" />
      </Button>
    </div>
  );
};

export default OnboardingResultEmpty;
