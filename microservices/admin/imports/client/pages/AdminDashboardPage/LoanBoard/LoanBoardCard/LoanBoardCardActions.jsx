// @flow
import React from 'react';

import IconButton from 'core/components/IconButton';

type LoanBoardCardActionsProps = {};

const LoanBoardCardActions = (props: LoanBoardCardActionsProps) => (
  <IconButton
    type="more"
    size="small"
    className="more-button"
    iconProps={{ fontSize: 'default' }}
    onClick={(e) => {
      e.stopPropagation();
    }}
  />
);

export default LoanBoardCardActions;
