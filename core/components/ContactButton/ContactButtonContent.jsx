import React from 'react';

import T from '../Translation';

const ContactButtonContent = ({ titleId, icon, href, label }) => (
  <a href={href} className="contact-button-content primary">
    <div className="iconDiv">{icon}</div>
    <div className="text">
      <p className="bold">
        <T id={titleId} />
      </p>
      {label}
    </div>
  </a>
);

export default ContactButtonContent;
