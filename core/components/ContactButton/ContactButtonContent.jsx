import React from 'react';

import T from 'core/components/Translation';

const ContactButtonContent = ({ titleId, icon, href, label, onClick }) => (
  <a href={href} className="contact-button-content primary" onClick={onClick}>
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
