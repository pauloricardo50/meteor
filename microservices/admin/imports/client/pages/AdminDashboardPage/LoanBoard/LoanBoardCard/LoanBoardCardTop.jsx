// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import StatusLabel from 'core/components/StatusLabel';
import { LOANS_COLLECTION } from 'core/api/constants';
import IconButton from 'core/components/IconButton';
import { employeesById } from 'core/arrays/epotekEmployees';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  status,
  loanId,
  name,
  title,
  assignee,
}: LoanBoardCardTopProps) => {
  const img = assignee && employeesById[assignee._id];
  return (
    <div className="top">
      <div className="left">
        <StatusLabel
          variant="dot"
          status={status}
          collection={LOANS_COLLECTION}
          allowModify
          docId={loanId}
        />

        <Tooltip title={assignee && assignee.firstName}>
          <img src={img ? img.src : '/img/placeholder.png'} alt="" />
        </Tooltip>

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
  );
};

export default LoanBoardCardTop;
