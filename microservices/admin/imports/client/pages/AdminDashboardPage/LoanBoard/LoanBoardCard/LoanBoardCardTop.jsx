// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { LOANS_COLLECTION } from 'core/api/constants';
import { assignAdminToUser } from 'core/api/methods';
import StatusLabel from 'core/components/StatusLabel';
import IconButton from 'core/components/IconButton';
import DropdownMenu from 'core/components/DropdownMenu';
import { CollectionIconLink } from 'core/components/IconLink';
import { employeesById } from 'core/arrays/epotekEmployees';
import { USERS_COLLECTION } from 'imports/core/api/constants';

type LoanBoardCardTopProps = {};

const LoanBoardCardTop = ({
  admins,
  assignee,
  loanId,
  name,
  status,
  userCache,
}: LoanBoardCardTopProps) => {
  const img = assignee && employeesById[assignee._id];
  const userId = userCache && userCache._id;
  const hasUser = !!userId;
  const title = userCache && userCache.firstName
    ? [userCache.firstName, userCache.lastName].filter(x => x).join(' ')
    : name;

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

        {userId ? (
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
        ) : (
          <Tooltip title={assignee && assignee.firstName}>
            <img src={img ? img.src : '/img/placeholder.png'} alt="" />
          </Tooltip>
        )}

        <Tooltip title={name}>
          <h4 className="title">
            {hasUser ? (
              <CollectionIconLink
                relatedDoc={{
                  ...userCache,
                  name: title,
                  collection: USERS_COLLECTION,
                }}
                showIcon={false}
              />
            ) : (
              title
            )}
          </h4>
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
