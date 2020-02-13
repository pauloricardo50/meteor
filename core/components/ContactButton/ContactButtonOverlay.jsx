import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';

import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import ContactButtonContent from './ContactButtonContent';

const ContactButtonOverlay = ({
  staff: { src, name, phoneNumber, email, gender } = {},
  openContact,
  handleCloseContact,
}) => (
  <ClickAwayListener
    onClickAway={handleCloseContact}
    // Disable the listener if the contact is closed
    // That way opening it from elsewhere won't trigger this listener
    mouseEvent={openContact ? undefined : false}
    touchEvent={openContact ? undefined : false}
  >
    <Grow in={openContact} style={{ 'transform-origin': 'bottom right' }}>
      <div className="card1 shadow-2 card-top contact-button-overlay">
        <div className="top">
          <img src={src} alt={name} />
          <div className="text">
            <h4 className="fixed-size no-margin staff-name">{name}</h4>
            <p className="secondary">
              <T id="ContactButton.yourAdvisor" values={{ gender }} />
            </p>
          </div>
        </div>
        <hr />
        <ContactButtonContent
          titleId="ContactButton.byPhone"
          icon={<Icon type="phone" className="icon" />}
          href={`tel:${phoneNumber}`}
          label={phoneNumber}
        />
        <ContactButtonContent
          titleId="ContactButton.byEmail"
          icon={<Icon type="mail" className="icon" />}
          href={`mailto:${email}`}
          label={email}
        />
      </div>
    </Grow>
  </ClickAwayListener>
);

export default ContactButtonOverlay;
