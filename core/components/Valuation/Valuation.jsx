// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { VALUATION_STATUS, WUEST_ERRORS } from '../../api/constants';
import Loading from '../Loading';
import ValuationContainer from './ValuationContainer';
import ValuationResult from './ValuationResult';
import ValuationError from './ValuationError';

const ERRORS_TO_DISPLAY = [
  WUEST_ERRORS.FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS,
];

type ValuationProps = {
  property: Object,
  handleEvaluateProperty: Function,
  isLoading: boolean,
  disabled: boolean,
  error: String,
};

export const Valuation = ({
  property: { valuation },
  handleEvaluateProperty,
  isLoading,
  disabled,
  error,
}: ValuationProps) => {
  if (isLoading) {
    return (
      <div className="card1 valuation">
        <Loading />
      </div>
    );
  }

  return (
    <div className="card1 valuation">
      <h2>
        <T id="Valuation.title" />
      </h2>
      <ValuationResult {...valuation} />
      {ERRORS_TO_DISPLAY.includes(error) && (
        <ValuationError error={<T id={`Valuation.error.${error}`} />} />
      )}
      <Button
        onClick={handleEvaluateProperty}
        raised={valuation.status === VALUATION_STATUS.NONE}
        primary
        disabled={disabled}
        className="valuation-button"
      >
        {disabled ? (
          <T id="ValuationButton.disabled" />
        ) : valuation.status === VALUATION_STATUS.NONE ? (
          <T id="ValuationButton.evaluate" />
        ) : (
          <T id="ValuationButton.reevaluate" />
        )}
      </Button>
    </div>
  );
};

export default ValuationContainer(Valuation);
