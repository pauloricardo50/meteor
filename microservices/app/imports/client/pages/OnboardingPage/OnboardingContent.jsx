import React, { useEffect } from 'react';

import { PROPERTY_CATEGORY } from 'core/api/properties/propertyConstants';

import OnboardingBorrowersForm from './OnboardingComponents/OnboardingBorrowersForm';
import OnboardingChoice from './OnboardingComponents/OnboardingChoice';
import OnboardingForm from './OnboardingComponents/OnboardingForm';
import { PromotionMiniature } from './OnboardingComponents/OnboardingPromotionMiniature';
import { PropertyMiniature } from './OnboardingComponents/OnboardingPropertyMiniature';
import OnboardingResult from './OnboardingComponents/OnboardingResult/OnboardingResult';
import { useOnboarding } from './OnboardingContext';
import { steps } from './onboardingSteps';

const Components = {
  OnboardingChoice,
  OnboardingResult,
  OnboardingForm,
  OnboardingBorrowersForm,
};

const OnboardingContent = () => {
  const { activeStep, stepIds, resetPosition, loan } = useOnboarding();
  const step = steps.find(({ id }) => id === activeStep);
  const isBadStep = !step || !stepIds.includes(activeStep);

  useEffect(() => {
    if (isBadStep) {
      resetPosition();
    }
  }, [isBadStep]);

  if (isBadStep) {
    return null;
  }

  const { component, id, props, onSubmit } = step;
  const Component = Components[component];

  return (
    <div className="onboarding-content">
      <Component id={id} key={id} {...props} onSubmit={onSubmit?.(loan)} />

      {loan.hasProProperty ? (
        <PropertyMiniature
          property={loan.properties.find(
            ({ category }) => category === PROPERTY_CATEGORY.PRO,
          )}
        />
      ) : null}

      {loan.hasPromotion ? (
        <PromotionMiniature promotion={loan.promotions[0]} />
      ) : null}
    </div>
  );
};

export default OnboardingContent;
