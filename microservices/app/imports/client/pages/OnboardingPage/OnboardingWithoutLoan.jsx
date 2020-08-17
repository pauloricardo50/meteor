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
  const hasPropertyOrPromotion = false;

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
    <>
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

            {!hasPropertyOrPromotion && (
              <>
                <Button
                  size="large"
                  className="m-4"
                  raised
                  primary
                  loading={loading}
                  onClick={() => handleInsert(PURCHASE_TYPE.ACQUISITION)}
                >
                  <T id="OnboardingWithoutLoan.ACQUISITION" />
                </Button>
                <Button
                  size="large"
                  className="m-4"
                  raised
                  secondary
                  loading={loading}
                  onClick={() => handleInsert(PURCHASE_TYPE.REFINANCING)}
                >
                  <T id="OnboardingWithoutLoan.REFINANCING" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div>
          <img
            src="/img/onboarding-illustration.png"
            alt="Onboarding e-Potek"
          />
        </div>
      </div>
    </>
  );
};

export default OnboardingWithoutLoan;
