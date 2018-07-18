// @flow
import React from 'react';

import Button from 'core/components/Button';
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
    <Button onClick={() => toggleOpen(!open)} variant="fab" color="primary">
      {open ? <Icon type="close" /> : <Icon type="forum" />}
    </Button>
    <ContactButtonOverlay {...props} open={open} />
  </div>
);

export default ContactButtonContainer(ContactButton);
