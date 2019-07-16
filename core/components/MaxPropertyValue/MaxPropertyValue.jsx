// @flow
import React from 'react';
import cx from 'classnames';

import MaxPropertyValueContainer, { STATE } from './MaxPropertyValueContainer';
import MaxPropertyValueEmptyState from './MaxPropertyValueEmptyState';
import MaxPropertyValueResults from './MaxPropertyValueResults';
import Loading from '../Loading';

type MaxPropertyValueProps = {};

const renderState = (props) => {
  const { state, loading, loan } = props;

  if (loading) {
    return (
      <div className="animated fadeIn">
        <Loading />
        <h5>Algorithmes au travail...</h5>
        <p>Détendez-vous</p>
      </div>
    );
  }

  if (state !== STATE.DONE) {
    return <MaxPropertyValueEmptyState {...props} />;
  }

  return <MaxPropertyValueResults {...props} />;
};

const MaxPropertyValue = ({ blue, ...props }: MaxPropertyValueProps) => (
  <div className="flex-row center">
    <div className={cx('card1 max-property-value', { blue })}>
      {renderState(props)}
    </div>
  </div>
);

export default MaxPropertyValueContainer(MaxPropertyValue);
