// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';

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
  const title = userCache
    ? [userCache.firstName, userCache.lastName].filter(x => x).join(' ')
    : name;

  return (
    <div
      className="loan-board-card card1 card-top card-hover"
      onClick={() => setLoanId(loanId)}
      style={style}
    >
      <div className="top">
        <div className="left">
          <StatusLabel
            variant="dot"
            status={status}
            collection={LOANS_COLLECTION}
            allowModify
            docId={loanId}
          />

          <Tooltip title={name}>
            <h4 className="title">{title}</h4>
          </Tooltip>
        </div>
        <div className="right">
          <IconButton
            type="check"
            className="loan-board-card-tasks"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
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
