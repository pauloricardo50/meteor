import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import useSearchParams from 'core/hooks/useSearchParams';
import { createRoute } from 'core/utils/routerUtils';

import appRoutes from '../../../startup/client/appRoutes';
import { insertAnonymousLoan } from './onboardingHelpers';
import OnboardingMarketing from './OnboardingMarketing';

const OnboardingWithoutLoan = () => {
  const { purchaseType } = useSearchParams();
  const shouldInsertLoan = Object.values(PURCHASE_TYPE).includes(purchaseType);
  const [loading, setLoading] = useState(shouldInsertLoan);
  const [redirect, setRedirect] = useState();
  const hasPropertyOrPromotion = false; // TODO:

  const handleInsert = pType => {
    if (!loading) {
      setLoading(true);
    }

    return insertAnonymousLoan(pType).then(loanId => {
      setRedirect(createRoute(appRoutes.LOAN_ONBOARDING_PAGE.path, { loanId }));
    });
  };

  useEffect(() => {
    if (shouldInsertLoan) {
      handleInsert(purchaseType);
    }
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  if (shouldInsertLoan) {
    // Loan should insert itself and then OnboardingPage routes the user
    // to the proper step
    return null;
  }

  return (
    <div className="animated fadeIn">
      <OnboardingMarketing />

      <div className="onboarding-without-loan">
        <div>
          <h1>
            <T id="OnboardingWithoutLoan.title" />
          </h1>
          <p>
            <T id="OnboardingWithoutLoan.description" />
          </p>

          <div className="onboarding-without-loan-ctas">
            {hasPropertyOrPromotion && (
              <Button
                size="large"
                loading={loading}
                onClick={() => handleInsert(PURCHASE_TYPE.ACQUISITION)}
              >
                <T id="OnboardingWithoutLoan.start" />
              </Button>
            )}

            {!hasPropertyOrPromotion &&
              Object.values(PURCHASE_TYPE).map(type => (
                <Button
                  key={type}
                  size="large"
                  className="m-4"
                  raised
                  color={
                    type === PURCHASE_TYPE.ACQUISITION ? 'primary' : 'secondary'
                  }
                  loading={loading}
                  onClick={() => handleInsert(PURCHASE_TYPE[type])}
                >
                  <T id={`OnboardingWithoutLoan.${type}`} />
                </Button>
              ))}
          </div>
        </div>

        <div>
          <img
            src="/img/onboarding-illustration.png"
            alt="Onboarding e-Potek"
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingWithoutLoan;
