import React, { useMemo, useState } from 'react';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import MaxPropertyValueCertificate from 'core/components/MaxPropertyValue/MaxPropertyValueCertificate';
import MaxPropertyValueResultsTable from 'core/components/MaxPropertyValue/MaxPropertyValueResultsTable';
import T from 'core/components/Translation';
import Calculator from 'core/utils/Calculator';

import { useOnboarding } from '../../OnboardingContext';
import { calculateMaxPropertyValue } from './OnboardingResultEmpty';

const OnboardingResultMaxPropertyValue = ({ loan }) => {
  const [loading, setLoading] = useState(false);
  const borrowerHash = useMemo(
    () => Calculator.getBorrowerFormHash({ loan }),
    [],
  );
  const { steps } = useOnboarding();
  const canton = steps.find(({ id }) => id === 'canton')?.value;
  const shouldRecalculate =
    borrowerHash != loan.maxPropertyValue.borrowerHash ||
    (canton ? canton !== loan.maxPropertyValue.canton : false);

  const recalculate = () => {
    setLoading(true);
    calculateMaxPropertyValue(loan).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="onboarding-result-max-property-value max-property-value-results-table">
      <MaxPropertyValueResultsTable
        loan={loan}
        showMoreProps={{ primary: true }}
      />
      <div className="flex center-align">
        {shouldRecalculate ? (
          <Button
            raised
            secondary
            icon={<Icon type="loop" />}
            className="mt-16 mr-8 mb-8"
            loading={loading}
            onClick={recalculate}
          >
            <T id="OnboardingResult.recalculate" />
          </Button>
        ) : null}

        <MaxPropertyValueCertificate
          loan={loan}
          buttonProps={{ className: 'mt-16 mb-8', loading }}
          shouldRecalculate={shouldRecalculate}
          recalculate={recalculate}
        />
      </div>
    </div>
  );
};

export default OnboardingResultMaxPropertyValue;
