// @flow
import React from 'react';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

import { EXPERTISE_STATUS } from '../../api/constants';
import Loading from '../Loading';
import ValuationContainer from './ValuationContainer';
import { toMoney } from 'core/utils/conversionFunctions';

type ValuationProps = {
  property: Object,
  handleEvaluateProperty: Function,
  isLoading: boolean,
  disabled: boolean,
};

const renderResults = ({ min, max, value }) => (
  <div className="valuation-results">
    <h3>CHF</h3>
    <h2>
      {toMoney(min)} - {toMoney(max)}
    </h2>
    <h1>{toMoney(value)}</h1>
  </div>
);
const renderError = error => <h3 className="error">{error}</h3>;

export const Valuation = ({
  property: { valuation },
  handleEvaluateProperty,
  isLoading,
  disabled,
}: ValuationProps) => {
  if (isLoading) {
    return <Loading />;
  }
  let content;
  switch (valuation.status) {
  case EXPERTISE_STATUS.DONE:
    content = renderResults(valuation);
    break;
  case EXPERTISE_STATUS.ERROR:
    content = renderError(valuation.error);
    break;
  default:
    content = null;
  }

  return (
    <div className="card1 valuation">
      <h2>
        <T id="Valuation.title" />
      </h2>
      {content}
      <Button
        onClick={handleEvaluateProperty}
        raised
        primary
        disabled={disabled}
      >
        {disabled ? (
          <T id="ValuationButton.disabled" />
        ) : (
          <T id="ValuationButton.enabled" />
        )}
      </Button>
    </div>
  );
};

export default ValuationContainer(Valuation);
