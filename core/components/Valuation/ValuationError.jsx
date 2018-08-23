// @flow
import React from 'react';

type ValuationErrorProps = {
  error: React.Node,
};

const ValuationError = ({ error }: ValuationErrorProps) => (
  <h3 className="error">{error}</h3>
);

export default ValuationError;
