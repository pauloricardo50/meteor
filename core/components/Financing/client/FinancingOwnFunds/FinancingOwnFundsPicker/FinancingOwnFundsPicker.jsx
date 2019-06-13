// @flow
import React from 'react';
import { compose } from 'recompose';

import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import OwnFundsAdder from './OwnFundsAdder';
import CurrentOwnFunds from './CurrentOwnFunds';

type FinancingOwnFundsPickerProps = {};

const FinancingOwnFundsPicker = ({
  structureId,
  structure,
  ...data
}: FinancingOwnFundsPickerProps) => (
  <div className="ownFundsPicker">
    {structure.ownFunds.map((ownFunds, index) => (
      <CurrentOwnFunds
        key={`${ownFunds.borrowerId}${ownFunds.type}${ownFunds.usageType}`}
        ownFundsIndex={index}
        ownFunds={ownFunds}
        structureId={structureId}
        structure={structure}
        {...data}
      />
    ))}
    <OwnFundsAdder
      structureId={structureId}
      disabled={structure.disableForms}
    />
  </div>
);

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
)(FinancingOwnFundsPicker);
