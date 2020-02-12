import { Meteor } from 'meteor/meteor';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-light-svg-icons/faInfoCircle';

import Box from 'core/components/Box';
import T from 'core/components/Translation';
import UserCreator from '../../../../components/UserCreator';

const BorrowersProgressSignup = props => {
  if (Meteor.user()) {
    return null;
  }

  return (
    <Box className="borrowers-progress-signup">
      <div>
        <FontAwesomeIcon icon={faInfoCircle} className="icon mr-8" />
        <h4>
          <T id="BorrowersProgress.signup" />
        </h4>
      </div>
      <UserCreator
        buttonProps={{ primary: true, label: 'Créez votre compte' }}
        ctaId="borrowersProgress"
      />
    </Box>
  );
};

export default BorrowersProgressSignup;
