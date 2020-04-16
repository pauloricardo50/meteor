import React from 'react';

import { PURCHASE_TYPE } from 'core/api/loans/loanConstants';
import Button from 'core/components/Button';
import AcquisitionIcon from 'core/components/Icon/AcquisitionIcon';
import RefinancingIcon from 'core/components/Icon/RefinancingIcon';
import T from 'core/components/Translation';

const WelcomeScreenCtas = ({ insertLoan, loading }) => (
  <>
    <h3>Quel est votre projet?</h3>
    <Button
      raised
      secondary
      onClick={() => insertLoan({ purchaseType: PURCHASE_TYPE.ACQUISITION })}
      className="welcome-screen-cta mb-8"
      loading={loading}
      icon={<AcquisitionIcon fontSize="1.5em" />}
    >
      <T id="Forms.purchaseType.ACQUISITION" />
    </Button>
    <Button
      raised
      secondary
      onClick={() => insertLoan({ purchaseType: PURCHASE_TYPE.REFINANCING })}
      className="welcome-screen-cta mb-8"
      loading={loading}
      icon={<RefinancingIcon fontSize="1.5em" />}
    >
      <T id="Forms.purchaseType.REFINANCING" />
    </Button>
  </>
);

export default WelcomeScreenCtas;
