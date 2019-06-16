// @flow
import React from 'react';

import { LOANS_COLLECTION } from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';
import LoanBoardCardAssignee from './LoanBoardCardAssignee';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  admins,
  assignee,
  loanId,
  name,
  status,
  userCache,
  renderComplex,
}: LoanBoardCardTopProps) => {
  const userId = userCache && userCache._id;
  const hasUser = !!userId;
  const title = userCache && userCache.firstName
    ? [userCache.firstName, userCache.lastName].filter(x => x).join(' ')
    : name;

  return (
    <>
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={LOANS_COLLECTION}
          allowModify={renderComplex}
          docId={loanId}
          showTooltip={renderComplex}
        />

        <LoanBoardCardAssignee
          renderComplex={renderComplex}
          assignee={assignee}
          userCache={userCache}
          admins={admins}
        />

        {renderComplex ? (
          <LoanBoardCardTitle
            hasUser={hasUser}
            name={name}
            title={title}
            userCache={userCache}
          />
        ) : (
          <h4 className="title title-placeholder">{title}</h4>
        )}
      </div>

      <div className="right">
        {renderComplex && <LoanBoardCardActions loanId={loanId} />}
      </div>
    </>
  );
};

export default React.memo(LoanBoardCardTop);
