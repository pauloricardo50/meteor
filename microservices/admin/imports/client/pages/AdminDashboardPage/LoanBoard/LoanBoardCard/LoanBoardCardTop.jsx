// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { LOANS_COLLECTION } from 'core/api/constants';
import { assignAdminToUser } from 'core/api/methods';
import StatusLabel from 'core/components/StatusLabel';
import IconButton from 'core/components/IconButton';
import DropdownMenu from 'core/components/DropdownMenu';
import { employeesById } from 'core/arrays/epotekEmployees';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  admins,
  assignee,
  loanId,
  name,
  status,
  title,
  userId,
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
          {userId ? (
            <DropdownMenu
              className="status-label-dropdown"
              renderTrigger={({ handleOpen }) => (
                <img
                  src={img ? img.src : '/img/placeholder.png'}
                  alt=""
                  onClick={handleOpen}
                />
              )}
              options={admins.map(({ firstName, _id }) => ({
                id: _id,
                label: firstName,
                onClick: () => assignAdminToUser.run({ adminId: _id, userId }),
              }))}
              noWrapper
            />
          ) : (
            <img src={img ? img.src : '/img/placeholder.png'} alt="" />
          )}
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

export default React.memo(LoanBoardCardTop);
