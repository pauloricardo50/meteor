import React from 'react';

import Icon from 'core/components/Icon';
import colors from 'core/config/colors';

const RequestContact = ({
  name,
  email = '-',
  title = 'Contact perso',
  icon,
  phoneNumber = '-',
  className,
}) => (
  <div key={email} className={className}>
    <div className="flex center-align">
      <div
        className="flex center-align mr-4"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        <Icon type={icon} className="mr-4" />
        <h4 className="font-size-5">{name}</h4>
      </div>
      <h5>
        <small className="secondary">{title}</small>
      </h5>
    </div>
    <div className="flex center-align">
      <span className="flex center-align mr-8">
        <Icon
          className="mr-4"
          type="mail"
          style={{ color: colors.borderGrey }}
        />
        <a
          className="color"
          href={`mailto:${email}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {email}
        </a>
      </span>
      <span className="flex center-align">
        <Icon
          className="mr-4"
          type="phone"
          style={{ color: colors.borderGrey }}
        />
        <a key={phoneNumber} href={`tel:${phoneNumber}`}>
          <span>{phoneNumber}</span>
        </a>
      </span>
    </div>
  </div>
);

export default RequestContact;
