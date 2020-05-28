import React, { useContext } from 'react';
import Fab from '@material-ui/core/Fab';

import useImpersonatedSession from '../../hooks/useImpersonatedSession';
import Icon from '../Icon';
import { ContactButtonContext } from './ContactButtonContext';
import ContactButtonOverlay from './ContactButtonOverlay';
import ImpersonateNotification from './ImpersonateNotification';
import SimpleContactButtonContainer from './SimpleContactButtonContainer';

export const ContactButton = props => {
  const { openContact, toggleOpenContact } = useContext(ContactButtonContext);
  const [impersonatedSession, options] = useImpersonatedSession();

  const handleCloseContact = () => toggleOpenContact(false);

  return options.shouldRenderNotification ? (
    <ImpersonateNotification
      impersonatedSession={impersonatedSession}
      options={options}
    />
  ) : (
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
