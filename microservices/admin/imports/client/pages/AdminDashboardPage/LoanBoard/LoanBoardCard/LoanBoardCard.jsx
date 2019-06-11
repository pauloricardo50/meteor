// @flow
import React from 'react';
import moment from 'moment';
import cx from 'classnames';

import { Money } from 'core/components/Translation';
import LoanBoardCardTop from './LoanBoardCardTop';

type LoanBoardCardProps = {};

const LoanBoardCard = ({
  data: loan,
  setLoanId,
  style,
}: LoanBoardCardProps) => {
  const {
    _id: loanId,
    name,
    status,
    userCache = {},
    nextDueDate = {},
    selectedStructure,
    structures = [],
  } = loan;
  const assignee = userCache
    && userCache.assignedEmployeeCache
    && userCache.assignedEmployeeCache;
  const dueAtMoment = nextDueDate.dueAt && moment(nextDueDate.dueAt);
  const isLate = dueAtMoment && dueAtMoment < moment();
  const title = (userCache && userCache.firstName)
    ? [userCache.firstName, userCache.lastName].filter(x => x).join(' ')
    : name;
  const structure = structures.find(({ id }) => id === selectedStructure);

  return (
    <div
      className="loan-board-card card1 card-top card-hover"
      onClick={() => setLoanId(loanId)}
      style={style}
    >
      <LoanBoardCardTop
        status={status}
        loanId={loanId}
        name={name}
        title={title}
        assignee={assignee}
      />
      {nextDueDate.dueAt && (
        <h5>
          <span className={cx({ 'error-box': isLate, secondary: !isLate })}>
            {dueAtMoment.fromNow()}
          </span>
          :&nbsp;
          <span>{nextDueDate.title}</span>
        </h5>
      )}
      {structure && (
        <h4 className="wanted-loan">
          {structure.wantedLoan ? (
            <Money value={structure.wantedLoan} />
          ) : (
            <span className="secondary">Pas encore structuré</span>
          )}
        </h4>
      )}
    </div>
  );
};

export default React.memo(LoanBoardCard);
