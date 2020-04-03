import React from 'react';

import { updateUser } from 'core/api/users/methodDefinitions';
import Toggle from 'core/components/Toggle';

const BOARD_IDS = {
  LOANS: 'loans',
  INSURANCE_REQUESTS: 'insuranceRequests',
};

const DefaultBoardIdModifier = ({ currentUser }) => {
  const { _id: userId, defaultBoardId } = currentUser;

  return (
    <Toggle
      labelTop="Board préféré"
      labelLeft="Hypothèques"
      labelRight="Assurances"
      toggled={defaultBoardId === BOARD_IDS.INSURANCE_REQUESTS}
      onToggle={toggled =>
        updateUser.run({
          userId,
          object: {
            defaultBoardId: toggled
              ? BOARD_IDS.INSURANCE_REQUESTS
              : BOARD_IDS.LOANS,
          },
        })
      }
    />
  );
};

export default DefaultBoardIdModifier;
