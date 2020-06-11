import React from 'react';

import LenderListItemRules from './LenderListItemRules';

const LenderListItem = ({ name, ...props }) => (
  <div className="lender-list-item">
    <h4>{name}</h4>
    <div>
      <LenderListItemRules {...props} />
    </div>
  </div>
);

export default LenderListItem;
