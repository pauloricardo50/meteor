// @flow
import React from 'react';
import { compose } from 'recompose';

import FinancingStructuresDataContainer from '../../containers/FinancingStructuresDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import OwnFundsAdder from './OwnFundsAdder';
import CurrentOwnFunds from './CurrentOwnFunds';

type FinancingStructuresOwnFundsPickerProps = {};

const FinancingStructuresOwnFundsPicker = ({
  structureId,
  structure,
  ...data
}: FinancingStructuresOwnFundsPickerProps) => (
  <div className="ownFundsPicker">
    {structure.ownFunds.map((ownFunds, index) => (
      <CurrentOwnFunds
        key={index}
        ownFundsIndex={index}
        ownFunds={ownFunds}
        {...data}
      />
    ))}
    <OwnFundsAdder structureId={structureId} />
  </div>
);

export default compose(
  FinancingStructuresDataContainer({ asArrays: true }),
  SingleStructureContainer,
)(FinancingStructuresOwnFundsPicker);
