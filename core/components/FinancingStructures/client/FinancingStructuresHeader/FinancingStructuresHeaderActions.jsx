// @flow
import React from 'react';

import DropdonwMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import FinancingStructuresHeaderActionsContainer from './FinancingStructuresHeaderActionsContainer';

type FinancingStructuresHeaderActionsProps = {
  options: Array<{ onClick: Function, label: React.Node }>,
};

const FinancingStructuresHeaderActions = ({
  options,
}: FinancingStructuresHeaderActionsProps) => (
  <DropdonwMenu
    iconType="more"
    className="financing-structures-header-actions"
    tooltip={<T id="general.settings" />}
    options={options}
  />
);

export default FinancingStructuresHeaderActionsContainer(FinancingStructuresHeaderActions);
