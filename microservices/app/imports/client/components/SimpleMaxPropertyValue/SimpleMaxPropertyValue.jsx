// @flow
import React from 'react';
import cx from 'classnames';

import Loading from 'core/components/Loading';
import MaxPropertyValueResults from 'core/components/MaxPropertyValue/MaxPropertyValueResults';
import MaxPropertyValueContainer, {
  STATE,
} from 'core/components/MaxPropertyValue/MaxPropertyValueContainer';
import SimpleMaxPropertyValueSignup from './SimpleMaxPropertyValueSignup';
import SimpleMaxPropertyValueEmptyState from './SimpleMaxPropertyValueEmptyState';

type SimpleMaxPropertyValueProps = {};

export const SimpleMaxPropertyValue = (props: MaxPropertyValueProps) => {
  const { blue, state, loading, loan, fixed = false } = props;

  if (loading) {
    return (
      <div className={cx('simple-max-property-value loading', { fixed })}>
        <div className="animated fadeIn">
          <Loading />
          <h4>Algorithmes au travail...</h4>
          <p>Détendez-vous un instant</p>
        </div>
      </div>
    );
  }

  if (state !== STATE.DONE) {
    return <SimpleMaxPropertyValueEmptyState {...props} />;
  }

  if (loan.maxPropertyValueExists) {
    return <SimpleMaxPropertyValueSignup {...props} />;
  }

  return (
    <div className={cx('simple-max-property-value', { blue, fixed })}>
      <MaxPropertyValueResults {...props} />
    </div>
  );
};

export default MaxPropertyValueContainer(SimpleMaxPropertyValue);
