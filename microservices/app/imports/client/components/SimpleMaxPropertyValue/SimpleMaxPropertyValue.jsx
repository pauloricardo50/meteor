import React from 'react';
import cx from 'classnames';

import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import MaxPropertyValueLoading from 'core/components/MaxPropertyValue/MaxPropertyValueLoading';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';

import SimpleMaxPropertyValueEmptyState from './SimpleMaxPropertyValueEmptyState';
import SimpleMaxPropertyValueSignup from './SimpleMaxPropertyValueSignup';

const getContent = props => {
  const { state, loading, loan } = props;

  if (loading) {
    return <MaxPropertyValueLoading />;
  }

  if (state !== STATE.DONE) {
    return <SimpleMaxPropertyValueEmptyState {...props} />;
  }

  if (loan.maxPropertyValueExists) {
    return <SimpleMaxPropertyValueSignup {...props} />;
  }

  return (
    <MaxPropertyValueResults showSecondButton={!loan.hasPromotion} {...props} />
  );
};

export const SimpleMaxPropertyValue = props => {
  const { blue, noPadding } = props;

  return (
    <div className={cx('max-property-value simple', { blue, noPadding })}>
      {getContent(props)}
    </div>
  );
};

export default MaxPropertyValueContainer(SimpleMaxPropertyValue);
