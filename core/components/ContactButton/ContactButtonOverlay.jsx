// @flow
import React from 'react';
import cx from 'classnames';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

import ContactButtonContent from './ContactButtonContent';

type ContactButtonOverlayProps = {
  staff: {
    name: string,
    email: string,
    phoneNumber: string,
    src: string,
  },
  openContact: boolean,
};

const ContactButtonOverlay = ({
  staff: { src, name, phoneNumber, email } = {},
  openContact,
}: ContactButtonOverlayProps) => (
  <div
    className={cx('card1 shadow-2 card-top contact-button-overlay', {
      closed: !openContact,
    })}
  >
    <div className="top">
      <img src={src} alt={name} />
      <div className="text">
        <h4 className="fixed-size no-margin staff-name">{name}</h4>
        <p className="secondary">
          <T id="ContactButton.yourAdvisor" />
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
);

export default ContactButtonOverlay;
