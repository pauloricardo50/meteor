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
    phone: string,
    src: string,
  },
  open: boolean,
};

const ContactButtonOverlay = ({
  staff: { src, name, phone, email },
  open,
}: ContactButtonOverlayProps) => (
  <div
    className={cx('card1 card-top contact-button-overlay', { closed: !open })}
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
      href={`tel:${phone}`}
      label={phone}
    />
    <ContactButtonContent
      titleId="ContactButton.byEmail"
      icon={<Icon type="mail" className="icon" />}
      href={`tel:${email}`}
      label={email}
    />
  </div>
);

export default ContactButtonOverlay;
