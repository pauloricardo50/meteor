// @flow
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';

import { CollectionIconLink } from 'core/components/IconLink';
import { USERS_COLLECTION } from 'core/api/constants';

type LoanBoardCardTitleProps = {};

const LoanBoardCardTitle = ({
  hasUser,
  name,
  userCache,
  title,
}: LoanBoardCardTitleProps) => (
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
);

export default LoanBoardCardTitle;
