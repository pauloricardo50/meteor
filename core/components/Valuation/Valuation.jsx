// @flow
import React from 'react';

import Button from 'core/components/Button';
import { EXPERTISE_STATUS } from '../../api/constants';
import Loading from '../Loading';
import ValuationContainer from './ValuationContainer';

type ValuationProps = {
  property: Object,
  handleEvaluateProperty: Function,
  isLoading: boolean,
  disabled: boolean,
};

const renderResults = ({ min, max }) => (
  <h2>
    {min} - {max}
  </h2>
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
    <div>
      {content}
      <Button onClick={handleEvaluateProperty} disabled={disabled}>
        Evaluez votre bien
      </Button>
    </div>
  );
};

export default ValuationContainer(Valuation);
