// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { assignAdminToUser } from 'core/api/methods';
import DropdownMenu from 'core/components/DropdownMenu';
import { employeesById } from 'core/arrays/epotekEmployees';

type LoanBoardCardAssigneeProps = {};

const LoanBoardCardAssignee = ({
  renderComplex,
  assignee,
  userCache,
  admins,
}: LoanBoardCardAssigneeProps) => {
  const img = (assignee && employeesById[assignee._id].src) || '/img/placeholder.png';
  const userId = userCache && userCache._id;

  if (renderComplex) {
    if (userId) {
      return (
        <DropdownMenu
          className="status-label-dropdown"
          renderTrigger={({ handleOpen }) => (
            <Tooltip title={assignee && assignee.firstName}>
              <img src={img} alt="" onClick={handleOpen} />
            </Tooltip>
          )}
          options={admins.map(({ firstName, _id }) => ({
            id: _id,
            label: firstName,
            onClick: () => assignAdminToUser.run({ adminId: _id, userId }),
          }))}
          noWrapper
        />
      );
    }

    return (
      <Tooltip title={assignee && assignee.firstName}>
        <img src={img} alt="" />
      </Tooltip>
    );
  }

  return <img src={img} alt="" />;
};

export default LoanBoardCardAssignee;
