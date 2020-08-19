import React from 'react';

import { SUCCESS } from 'core/api/constants';
import StatusIcon from 'core/components/StatusIcon';
import T from 'core/components/Translation/FormattedMessage';

import { EPOTEK_APP } from '../../constants';
import { trackCTA } from '../../utils/tracking';
import Button from '../Button';
import { useLayoutContext } from '../Layout/LayoutContext';
import { useWwwCalculator } from './WwwCalculatorState';

const toSentenceCase = str =>
  str.slice(0, 1).toUpperCase() + str.slice(1, str.length);

const WwwCalculatorStatus = () => {
  const { tracking_id: pageTrackingId } = useLayoutContext();
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
          component="a"
          href={`${EPOTEK_APP}?purchaseType=${purchaseType}`}
          onTrack={() =>
            trackCTA({
              buttonTrackingId: `${toSentenceCase(purchaseType)} calculator`,
              toPath: `${EPOTEK_APP}?purchaseType=${purchaseType}`,
              pageTrackingId,
            })
          }
        >
          <T id="WwwCalculatorStatus.continueProject" />
        </Button>
      </div>
      <hr className="mt-16" />
    </>
  );
};

export default WwwCalculatorStatus;
