// @flow
import React from 'react';

import Fab from '@material-ui/core/Fab';
import Icon from 'core/components/Icon';

import ContactButtonContainer from './ContactButtonContainer';
import ContactButtonOverlay from './ContactButtonOverlay';

type ContactButtonProps = {
  open: boolean,
  toggleOpen: Function,
};

export const ContactButton = ({
  open,
  toggleOpen,
  ...props
}: ContactButtonProps) => (
  <div className="contact-button">
    <Fab onClick={() => toggleOpen(!open)} color="primary">
      {open ? <Icon type="close" /> : <Icon type="forum" />}
    </Fab>
    <ContactButtonOverlay {...props} open={open} />
  </div>
);

export default ContactButtonContainer(ContactButton);
