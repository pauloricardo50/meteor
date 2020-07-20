import React from 'react';

import { SUCCESS } from 'core/api/constants';
import StatusIcon from 'core/components/StatusIcon';
import T from 'core/components/Translation/FormattedMessage';

import Button from '../Button';
import { useWwwCalculator } from './WwwCalculatorState';

const WwwCalculatorStatus = () => {
  const [{ statusMessageId, worstStatus, purchaseType }] = useWwwCalculator();

  if (statusMessageId.includes('tutorial')) {
    return (
      <>
        <hr className="mb-16" />
        <p className="message secondary text-center">
          <T id={statusMessageId} />
        </p>
        <hr className="mt-16" />
      </>
    );
  }

  return (
    <>
      <hr className="mb-16" />
      <div
        className="www-calculator-status animated fadeIn"
        key={statusMessageId}
      >
        <div className="flex center-align mb-16 p-16">
          <StatusIcon status={worstStatus} className="icon mr-8" />
          <p className="message">
            <T id={statusMessageId} />
          </p>
        </div>

        <Button
          raised
          primary={worstStatus !== SUCCESS}
          secondary={worstStatus === SUCCESS}
          size="large"
          Component="a"
          href={`${process.env.EPOTEK_APP}?purchaseType=${purchaseType}`}
        >
          <T id="getALoanText" />
        </Button>
      </div>
      <hr className="mt-16" />
    </>
  );
};

export default WwwCalculatorStatus;
