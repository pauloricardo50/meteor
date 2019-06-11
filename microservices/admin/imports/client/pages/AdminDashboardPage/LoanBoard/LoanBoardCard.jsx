// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import IconButton from 'core/components/IconButton';
import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';

type LoanBoardCardProps = {};

const LoanBoardCard = ({
  data: loan,
  setLoanId,
  style,
}: LoanBoardCardProps) => {
  const { _id: loanId, name, status, userCache = {}, nextDueDate = {} } = loan;
  const assigneeName = (userCache
      && userCache.assignedEmployeeCache
      && userCache.assignedEmployeeCache.firstName)
    || 'Personne';

  const dueAtMoment = nextDueDate.dueAt && moment(nextDueDate.dueAt);
  const isLate = dueAtMoment && dueAtMoment < moment();

  return (
    <div
      className="loan-board-card card1 card-top card-hover"
      onClick={() => setLoanId(loanId)}
      style={style}
    >
      <div className="top">
        <div>
          <h4 className="title">{name}</h4>
          <StatusLabel
            variant="dot"
            status={status}
            collection={LOANS_COLLECTION}
          />
        </div>
        <div>
          <IconButton type="check" className="loan-board-card-tasks" />
        </div>
      </div>
      <h4>
        <small>
          {userCache
            && [userCache.firstName, userCache.lastName].filter(x => x).join(' ')}
        </small>
      </h4>
      {nextDueDate.dueAt && (
        <h5>
          <span className={cx({ 'error-box': isLate, secondary: !isLate })}>
            {dueAtMoment.fromNow()}
          </span>
          :&nbsp;
          <span>{nextDueDate.title}</span>
        </h5>
      )}
      {assigneeName && (
        <>
          <hr />
          <p>{assigneeName}</p>
        </>
      )}
    </div>
  );
};

export default React.memo(LoanBoardCard);
