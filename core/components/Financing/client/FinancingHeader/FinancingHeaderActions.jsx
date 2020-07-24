import React from 'react';

import DropdonwMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import FinancingHeaderActionsContainer from './FinancingHeaderActionsContainer';

const FinancingHeaderActions = ({ options, selected }) => (
  <DropdonwMenu
    iconType="more"
    className="financing-structures-header-actions"
    tooltip={<T id="general.settings" />}
    options={options}
    buttonProps={{
      style: { border: 'none', color: selected ? 'white' : undefined },
    }}
  />
);

export default FinancingHeaderActionsContainer(FinancingHeaderActions);
