// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { LOANS_COLLECTION } from 'core/api/constants';
import { assignAdminToUser } from 'core/api/methods';
import StatusLabel from 'core/components/StatusLabel';
import DropdownMenu from 'core/components/DropdownMenu';
import { employeesById } from 'core/arrays/epotekEmployees';
import LoanBoardCardActions from './LoanBoardCardActions';
import LoanBoardCardTitle from './LoanBoardCardTitle';

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
  const img = assignee && employeesById[assignee._id];
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

        {renderComplex && userId ? (
          <DropdownMenu
            className="status-label-dropdown"
            renderTrigger={({ handleOpen }) => (
              <Tooltip title={assignee && assignee.firstName}>
                <img
                  src={img ? img.src : '/img/placeholder.png'}
                  alt=""
                  onClick={handleOpen}
                />
              </Tooltip>
            )}
            options={admins.map(({ firstName, _id }) => ({
              id: _id,
              label: firstName,
              onClick: () => assignAdminToUser.run({ adminId: _id, userId }),
            }))}
            noWrapper
          />
        ) : renderComplex ? (
          <Tooltip title={assignee && assignee.firstName}>
            <img src={img ? img.src : '/img/placeholder.png'} alt="" />
          </Tooltip>
        ) : (
          <img src={img ? img.src : '/img/placeholder.png'} alt="" />
        )}

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
