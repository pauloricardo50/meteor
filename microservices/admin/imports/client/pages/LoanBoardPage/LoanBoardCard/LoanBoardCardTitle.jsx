// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';

type LoanBoardCardTitleProps = {};

const LoanBoardCardTitle = ({
  borrowers = [],
  hasUser,
  name,
  title,
  user,
}: LoanBoardCardTitleProps) => {
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
      <h4 className="title">
        {hasUser ? (
          <CollectionIconLink
            relatedDoc={{
              ...user,
              name: title,
              collection: USERS_COLLECTION,
              additionalPopoverContent: borrowerContent,
            }}
            showIcon={false}
          />
        ) : (
          title
        )}
      </h4>
    </Tooltip>
  );
};

export default LoanBoardCardTitle;
