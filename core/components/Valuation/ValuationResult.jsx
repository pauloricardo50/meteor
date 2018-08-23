// @flow
import React from 'react';
import { VALUATION_STATUS } from '../../api/constants';
import ValuationError from './ValuationError';
import Microlocation from './Microlocation/Microlocation';
import { toMoney } from 'core/utils/conversionFunctions';
import T from 'core/components/Translation';

type ValuationResultProps = {
  min?: number,
  max?: number,
  value?: number,
  microlocation?: Object,
  error?: string,
  status: string,
};

const ValuationResult = ({
  min,
  max,
  value,
  microlocation,
  error,
  status,
}: ValuationResultProps) => {
  switch (status) {
  case VALUATION_STATUS.NONE:
    return null;
  case VALUATION_STATUS.ERROR:
    return <ValuationError error={error} />;
  case VALUATION_STATUS.DONE:
    return (
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

  default:
    return null;
  }
};

export default ValuationResult;
