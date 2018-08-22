// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import { toMoney } from 'core/utils/conversionFunctions';

import { VALUATION_STATUS, WUEST_ERRORS } from '../../api/constants';
import Loading from '../Loading';
import ValuationContainer from './ValuationContainer';
import Microlocation from './Microlocation/Microlocation';

type ValuationProps = {
  property: Object,
  handleEvaluateProperty: Function,
  isLoading: boolean,
  disabled: boolean,
  error: String,
};

const renderResults = ({ min, max, value, microlocation }) => (
  <div className="valuation-results">
    <div className="valuation-value">
      <h3 className="valuation-label">
        <T id="Valuation.rangeLabel" />
      </h3>
      <h2>
        {toMoney(min)} - {toMoney(max)}
      </h2>
    </div>
    {value && (
      <div className="valuation-value">
        <h3 className="valuation-label">
          <T id="Valuation.preciseValueLabel" />
        </h3>
        <h2>{toMoney(value)}</h2>
        <h4 className="warning">
          <T id="Valuation.preciseValueWarning" />
        </h4>
      </div>
    )}
    <Microlocation microlocation={microlocation} />
  </div>
);
const renderError = error => <h3 className="error">{error}</h3>;

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
  let content;
  switch (valuation.status) {
  case VALUATION_STATUS.DONE:
    content = [
      renderResults(valuation),
      error &&
        error === WUEST_ERRORS.FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS
        ? renderError(<T id={`Valuation.error.${error}`} />)
        : null,
    ];
    break;
  case VALUATION_STATUS.ERROR:
    content = renderError(valuation.error);
    break;
  default:
    content =
        error &&
        error === WUEST_ERRORS.FLOOR_NUMBER_EXCEEDS_TOTAL_NUMBER_OF_FLOORS
          ? renderError(<T id={`Valuation.error.${error}`} />)
          : null;
  }

  return (
    <div className="card1 valuation">
      <h2>
        <T id="Valuation.title" />
      </h2>
      {content}
      <Button
        onClick={handleEvaluateProperty}
        raised={valuation.status === VALUATION_STATUS.NONE}
        primary
        disabled={disabled}
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
