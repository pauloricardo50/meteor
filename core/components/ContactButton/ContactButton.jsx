// @flow
import React from 'react';

import Fab from '@material-ui/core/Fab';
import Icon from 'core/components/Icon';

import ContactButtonContainer from './ContactButtonContainer';
import ContactButtonOverlay from './ContactButtonOverlay';

type ContactButtonProps = {
  openContact: boolean,
  toggleOpenContact: Function,
};

export const ContactButton = ({
  openContact,
  toggleOpenContact,
  ...props
}: ContactButtonProps) => (
  <div className="contact-button">
    <Fab onClick={() => toggleOpenContact(!openContact)} color="primary">
      {openContact ? <Icon type="close" /> : <Icon type="forum" />}
    </Fab>
    <ContactButtonOverlay {...props} openContact={openContact} />
  </div>
);

export default ContactButtonContainer(ContactButton);
