// @flow
import React from 'react';

import MaxPropertyValueContainer, { STATE } from './MaxPropertyValueContainer';
import MaxPropertyValueEmptyState from './MaxPropertyValueEmptyState';
import MaxPropertyValueResults from './MaxPropertyValueResults';

type MaxPropertyValueProps = {};

const renderState = (props) => {
  const { state } = props;
  if (state !== STATE.DONE) {
    return <MaxPropertyValueEmptyState {...props} />;
  }

  return <MaxPropertyValueResults {...props} />;
};

const MaxPropertyValue = (props: MaxPropertyValueProps) => (
  <div className="flex-row center">
    <div className="card1 max-property-value">{renderState(props)}</div>
  </div>
);

export default MaxPropertyValueContainer(MaxPropertyValue);
