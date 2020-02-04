//      
import React from 'react';

import LenderListItemRules from './LenderListItemRules';

                              

const LenderListItem = ({
  organisation,
  loan,
  structureId,
}                     ) => {
  const { name } = organisation;
  return (
    <div className="lender-list-item">
      <h4>{name}</h4>
      <div>
        <LenderListItemRules
          organisation={organisation}
          loan={loan}
          structureId={structureId}
        />
      </div>
    </div>
  );
};

export default LenderListItem;
