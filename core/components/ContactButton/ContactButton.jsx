// @flow
import React, { useContext } from 'react';

import Fab from '@material-ui/core/Fab';
import Icon from 'core/components/Icon';

import ContactButtonContainer from './ContactButtonContainer';
import ContactButtonOverlay from './ContactButtonOverlay';
import { ContactButtonContext } from './ContactButtonContext';

type ContactButtonProps = {};

export const ContactButton = ({ ...props }: ContactButtonProps) => {
  const { openContact, toggleOpenContact } = useContext(ContactButtonContext);
  return (
    <div className="contact-button">
      <Fab onClick={() => toggleOpenContact(!openContact)} color="primary">
        {openContact ? <Icon type="close" /> : <Icon type="forum" />}
      </Fab>
      <ContactButtonOverlay {...props} openContact={openContact} />
    </div>
  );
};

export default ContactButtonContainer(ContactButton);
