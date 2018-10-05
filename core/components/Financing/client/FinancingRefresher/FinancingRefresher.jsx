// @flow
import React from 'react';

import T from '../../../Translation';
import Button from '../../../Button';
import Icon from '../../../Icon';
import FinancingRefresherContainer from './FinancingRefresherContainer';

type FinancingRefresherProps = {};

const APPEAR_DELAY = 5000;

export const FinancingRefresher = ({
  showRefresh,
  handleRefresh,
}) => {
  if (showRefresh) {
    return (
      <Button
        raised
        primary
        onClick={handleRefresh}
        className="financing-structures-refresher animated fadeInDown"
        style={{ animationDelay: `${APPEAR_DELAY}ms` }}
      >
        <Icon type="loop" />
        <T id="FinancingRefresher.label" />
      </Button>
    );
  }

  return null;
};

export default FinancingRefresherContainer(FinancingRefresher);
