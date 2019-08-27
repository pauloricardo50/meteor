// @flow
import React from 'react';

import LenderListItem from './LenderListItem';

type LenderListProps = {};

const LenderList = ({ organisations, loan, structureId }: LenderListProps) => (
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
