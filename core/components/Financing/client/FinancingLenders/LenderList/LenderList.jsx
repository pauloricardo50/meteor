//      
import React from 'react';

import LenderListItem from './LenderListItem';

                          

const LenderList = ({ organisations, loan, structureId }                 ) => (
  <div className="lender-list">
    {organisations
      .filter(({ lenderRules }) => lenderRules && lenderRules.length > 0)
      .map(org => (
        <LenderListItem
          key={org._id}
          organisation={org}
          loan={loan}
          structureId={structureId}
        />
      ))}
  </div>
);

export default LenderList;
