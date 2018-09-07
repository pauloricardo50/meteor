// @flow
import React from 'react';
import { compose } from 'recompose';

import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import OwnFundsAdder from './OwnFundsAdder';

type FinancingStructuresOwnFundsPickerProps = {};

const FinancingStructuresOwnFundsPicker = (props: FinancingStructuresOwnFundsPickerProps) => (
  <div className="ownFundsPicker">
    <OwnFundsAdder />
  </div>
);

export default compose(
  FinancingStructuresDataContainer({ asArrays: true }),
  SingleStructureContainer,
)(FinancingStructuresOwnFundsPicker);
