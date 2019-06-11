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
  admins,
}: LoanBoardCardProps) => {
  const {
    _id: loanId,
    name,
    status,
    userCache = {},
    nextDueDate = {},
    selectedStructure,
    structures = [],
    promotions = [],
  } = loan;
  const assignee = userCache
    && userCache.assignedEmployeeCache
    && userCache.assignedEmployeeCache;
  const dueAtMoment = nextDueDate.dueAt && moment(nextDueDate.dueAt);
  const isLate = dueAtMoment && dueAtMoment < moment();
  const structure = structures.find(({ id }) => id === selectedStructure);
  const promotion = promotions[0] && promotions[0].name;

  return (
    <div
      className="loan-board-card card1 card-hover"
      onClick={(event) => {
        console.log('event:', event);
        console.log('event wut:', event.wut);
        setLoanId(loanId);
      }}
      style={style}
    >
      <div className="card-top">
        <LoanBoardCardTop
          status={status}
          loanId={loanId}
          name={name}
          assignee={assignee}
          admins={admins}
          userCache={userCache}
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

      {promotion && <div className="card-bottom">{promotion}</div>}
    </div>
  );
};

export default React.memo(LoanBoardCard);
