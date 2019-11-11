// @flow
import React from 'react';

import DropdonwMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import FinancingHeaderActionsContainer from './FinancingHeaderActionsContainer';

type FinancingHeaderActionsProps = {
  options: Array<{ onClick: Function, label: React.Node }>,
};

const FinancingHeaderActions = ({ options }: FinancingHeaderActionsProps) => (
  <DropdonwMenu
    iconType="more"
    className="financing-structures-header-actions"
    tooltip={<T id="general.settings" />}
    options={options}
  />
);

export default FinancingHeaderActionsContainer(FinancingHeaderActions);
