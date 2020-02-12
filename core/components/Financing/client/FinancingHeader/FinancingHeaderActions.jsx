import React from 'react';

import DropdonwMenu from '../../../DropdownMenu';
import T from '../../../Translation';
import FinancingHeaderActionsContainer from './FinancingHeaderActionsContainer';

const FinancingHeaderActions = ({ options }) => (
  <DropdonwMenu
    iconType="more"
    className="financing-structures-header-actions"
    tooltip={<T id="general.settings" />}
    options={options}
  />
);

export default FinancingHeaderActionsContainer(FinancingHeaderActions);
