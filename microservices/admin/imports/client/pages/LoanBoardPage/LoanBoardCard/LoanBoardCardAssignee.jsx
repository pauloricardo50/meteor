import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { employeesById } from 'core/arrays/epotekEmployees';

const LoanBoardCardAssignee = ({ renderComplex, assigneeLinks }) => {
  const mainAssignee = assigneeLinks.find(({ isMain }) => isMain);
  const assignee = employeesById[mainAssignee?._id];
  const img = assignee?.src || '/img/placeholder.png';

  if (renderComplex) {
    return (
      <Tooltip title={assignee?.name}>
        <img src={img} alt="" />
      </Tooltip>
    );
  }

  return <img src={img} alt="" />;
};

export default LoanBoardCardAssignee;
