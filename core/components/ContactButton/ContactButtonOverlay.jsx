import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';

import Icon from '../Icon';
import T from '../Translation';
import CalendlyModal from './CalendlyModal';
import ContactButtonContent from './ContactButtonContent';

const ContactButtonOverlay = ({
  staff: { src, name, phoneNumber, email, gender, calendly } = {},
  openContact,
  handleCloseContact,
  style,
}) => {
  const [openCalendly, setOpenCalendy] = useState(false);

  const overlay = (
    <Grow in={openContact} style={{ 'transform-origin': 'bottom right' }}>
      <div
        className="card1 shadow-2 card-top contact-button-overlay"
        style={style}
      >
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
        <CalendlyModal
          link={calendly}
          open={openCalendly}
          onClose={() => setOpenCalendy(false)}
        />

        <ContactButtonContent
          titleId="ContactButton.calendly"
          icon={<Icon type="event" className="icon" />}
          href=""
          onClick={event => {
            event.preventDefault();
            event.stopPropagation();
            setOpenCalendy(true);
          }}
          label="Programmer en ligne"
        />
      </div>
    </Grow>
  );

  if (openContact) {
    return (
      <ClickAwayListener
        onClickAway={event => {
          if (openContact) {
            // Stop event propagation if clickawaylistener is triggering
            event.preventDefault();
            event.stopPropagation();
            handleCloseContact();
          }
        }}
      >
        {overlay}
      </ClickAwayListener>
    );
  }

  return overlay;
};

export default ContactButtonOverlay;
