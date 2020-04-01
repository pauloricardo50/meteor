import React from 'react';
import Toggle from 'core/components/Toggle';
import { updateUser } from 'core/api/methods';

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
