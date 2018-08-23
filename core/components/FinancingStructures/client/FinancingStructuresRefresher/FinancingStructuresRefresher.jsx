// @flow
import React from 'react';

import T from '../../../Translation';
import Button from '../../../Button';
import Icon from '../../../Icon';
import FinancingStructuresRefresherContainer from './FinancingStructuresRefresherContainer';

type FinancingStructuresRefresherProps = {};

const APPEAR_DELAY = 1000;

export const FinancingStructuresRefresher = ({
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
        <T id="FinancingStructuresRefresher.label" />
      </Button>
    );
  }

  return null;
};

export default FinancingStructuresRefresherContainer(FinancingStructuresRefresher);
