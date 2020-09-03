import React, { useEffect, useState } from 'react';
import { faEngineWarning } from '@fortawesome/pro-duotone-svg-icons/faEngineWarning';

import { setMaxPropertyValueOrBorrowRatio } from 'core/api/loans/methodDefinitions';
import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import FaIcon from 'core/components/Icon/FaIcon';
import T from 'core/components/Translation';
import colors from 'core/config/colors';

import { useOnboarding } from '../../OnboardingContext';
import OnboardingResultAnimation from './OnboardingResultAnimation';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { loan, setActiveStep } = useOnboarding();

  const handleCalculate = () => {
    setLoading(true);
    setError(null);
    calculateMaxPropertyValue(loan).catch(err => {
      setError(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    // Immediately calculate when this screen appears
    handleCalculate();
  }, []);

  if (loading) {
    return (
      <div>
        <h3 className="secondary mt-0">
          <T id="OnboardingResultEmpty.calculating" />
        </h3>
        <p>
          <T id="OnboardingResultEmpty.calculatingDescription" />
        </p>
        <div className="flex center animated fadeIn">
          <OnboardingResultAnimation />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <FaIcon
          icon={faEngineWarning}
          size="3x"
          color={colors.duotoneIconColor}
        />

        <h1>
          <T id="OnboardingResultEmpty.errorTitle" />
        </h1>
        <p className="description">
          <T id="OnboardingResultEmpty.errorDescription" />
        </p>

        <div className="flex">
          <Button
            raised
            primary
            onClick={() => setActiveStep('income')}
            className="mb-8 mr-8"
            size="large"
          >
            <T id="OnboardingResultEmpty.errorIncome" />
          </Button>

          <Button
            raised
            primary
            onClick={() => setActiveStep('ownFunds')}
            className="mb-8"
            size="large"
          >
            <T id="OnboardingResultEmpty.errorOwnFunds" />
          </Button>
        </div>
      </div>
    );
  }

  // This screen should never exist, but let's keep it here just in case
  return (
    <div className="animated fadeIn">
      <h1>
        <T id="OnboardingResultEmpty.calculateTitle" />
      </h1>

      <Button
        raised
        secondary
        onClick={handleCalculate}
        icon={<Icon type="right" />}
        iconAfter
        size="large"
      >
        <T id="OnboardingResultEmpty.calculateCta" />
      </Button>
    </div>
  );
};

export default OnboardingResultEmpty;
