// @flow
import React from 'react';
import cx from 'classnames';

import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueLoading from 'core/components/MaxPropertyValue/MaxPropertyValueLoading';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import SimpleMaxPropertyValueSignup from './SimpleMaxPropertyValueSignup';
import SimpleMaxPropertyValueEmptyState from './SimpleMaxPropertyValueEmptyState';

type SimpleMaxPropertyValueProps = {};

const getContent = (props) => {
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

  return <MaxPropertyValueResults {...props} />;
};

export const SimpleMaxPropertyValue = (props: SimpleMaxPropertyValueProps) => {
  const { blue, noPadding } = props;

  return (
    <div className={cx('max-property-value simple', { blue, noPadding })}>
      {getContent(props)}
    </div>
  );
};

export default MaxPropertyValueContainer(SimpleMaxPropertyValue);
