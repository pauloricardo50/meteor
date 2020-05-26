import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';
import Fab from '@material-ui/core/Fab';

import { setUserConnected } from '../../api/sessions/methodDefinitions';
import useImpersonatedSession from '../../hooks/useImpersonatedSession';
import Icon from '../Icon';
import AdminImpersonateNotification from './AdminImpersonateNotification';
import { ContactButtonContext } from './ContactButtonContext';
import ContactButtonOverlay from './ContactButtonOverlay';
import SimpleContactButtonContainer from './SimpleContactButtonContainer';
import UserImpersonateNotification from './UserImpersonateNotification';

export const ContactButton = props => {
  const { openContact, toggleOpenContact } = useContext(ContactButtonContext);
  const { impersonatedSession, loading } = useImpersonatedSession();

  if (loading) {
    return null;
  }

  if (impersonatedSession) {
    const { connectionId, userIsConnected, shared } = impersonatedSession;
    const currentSessionId = Meteor.connection._lastSessionId;
    if (connectionId === currentSessionId && userIsConnected) {
      return (
        <AdminImpersonateNotification
          impersonatedSession={impersonatedSession}
        />
      );
    }

    if (connectionId !== currentSessionId && !userIsConnected) {
      setUserConnected.run({ connectionId });
    }

    if (shared) {
      return (
        <UserImpersonateNotification
          impersonatedSession={impersonatedSession}
        />
      );
    }
  }

  const handleCloseContact = () => toggleOpenContact(false);

  return (
    <div className="contact-button">
      <Fab
        onClick={event => {
          // Allow onClickAwayListener to work properly
          event.preventDefault();

          toggleOpenContact();
        }}
        color="primary"
      >
        {openContact ? <Icon type="close" /> : <Icon type="forum" />}
      </Fab>

      <ContactButtonOverlay
        {...props}
        openContact={openContact}
        handleCloseContact={handleCloseContact}
      />
    </div>
  );
};

export default SimpleContactButtonContainer(ContactButton);
