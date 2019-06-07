// @flow
import React from 'react';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';

type LoanBoardCardProps = {};

const LoanBoardCard = ({ data: loan }: LoanBoardCardProps) => {
  const { name, status, userCache = {} } = loan;
  const assigneeName = userCache
    && userCache.assignedEmployeeCache
    && userCache.assignedEmployeeCache.firstName;
  return (
    <div className="loan-board-card card1 card-top card-hover">
      <div className="top">
        <h4 className="title">{name}</h4>
        <StatusLabel status={status} collection={LOANS_COLLECTION} />
      </div>
      <h4>
        <small>
          {userCache
            && [userCache.firstName, userCache.lastName].filter(x => x).join(' ')}
        </small>
      </h4>
      {assigneeName && (
        <>
          <hr />
          <p>{assigneeName}</p>
        </>
      )}
    </div>
  );
};

export default LoanBoardCard;
