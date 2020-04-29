import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { USERS_COLLECTION } from 'core/api/users/userConstants';
import { CollectionIconLink } from 'core/components/IconLink';

const LoanBoardCardTitle = ({ borrowers = [], hasUser, name, title, user }) => {
  const borrowersToDisplay = borrowers.filter(
    ({ name: borrowerName }) => borrowerName,
  );
  const borrowerContent = borrowersToDisplay.length > 0 && (
    <div>
      <b>Emprunteurs</b>
      <ul style={{ margin: 0 }}>
        {borrowersToDisplay.map(({ name: borrowerName, _id }) => (
          <li key={_id}>{borrowerName}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <Tooltip title={name}>
      <div className="title font-size-body">
        {hasUser ? (
          <CollectionIconLink
            relatedDoc={{
              ...user,
              name: title,
              _collection: USERS_COLLECTION,
              additionalPopoverContent: borrowerContent,
            }}
            showIcon={false}
          />
        ) : (
          title
        )}
      </div>
    </Tooltip>
  );
};

export default LoanBoardCardTitle;
