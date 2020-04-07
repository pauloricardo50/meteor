import React from 'react';
import cx from 'classnames';

import MaxPropertyValueContainer, { STATE } from './MaxPropertyValueContainer';
import MaxPropertyValueEmptyState from './MaxPropertyValueEmptyState';
import MaxPropertyValueLoading from './MaxPropertyValueLoading';
import MaxPropertyValueResults from './MaxPropertyValueResults';

const renderState = props => {
  const { state, loading, loan } = props;

  if (loading) {
    return <MaxPropertyValueLoading />;
  }

  if (state !== STATE.DONE) {
    return <MaxPropertyValueEmptyState {...props} />;
  }

  return <MaxPropertyValueResults {...props} />;
};

const MaxPropertyValue = ({ blue, ...props }) => (
  <div className="flex-row center">
    <div className={cx('card1 max-property-value', { blue })}>
      {renderState(props)}
    </div>
  </div>
);

export default MaxPropertyValueContainer(MaxPropertyValue);
