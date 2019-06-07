// @flow
import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';

type LoanBoardCardProps = {};

const LoanBoardCard = ({ data: loan }: LoanBoardCardProps) => {
  const { name, status, userCache = {} } = loan;
  return (
    <div className="loan-board-card card1 card-top card-hover">
      <h4 className="title">{name}</h4>
      <StatusLabel status={status} collection={LOANS_COLLECTION} />
      <p>
        {userCache
          && userCache.assignedEmployeeCache
          && userCache.assignedEmployeeCache.firstName}
      </p>
    </div>
  );
};

export default LoanBoardCard;
