// @flow
import React from 'react';

import MaxPropertyValueContainer, { STATE } from './MaxPropertyValueContainer';
import MaxPropertyValueEmptyState from './MaxPropertyValueEmptyState';
import MaxPropertyValueResults from './MaxPropertyValueResults';
import Loading from '../Loading';

type MaxPropertyValueProps = {};

const renderState = (props) => {
  const { state, loading } = props;

  if (loading) {
    return (
      <div>
        <Loading />
        <h5>Calcul en cours...</h5>
      </div>
    );
  }

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
