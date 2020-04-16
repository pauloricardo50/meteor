import React from 'react';

import T from '../Translation';

const ContactButtonContent = ({ titleId, icon, href, label, onClick }) => (
  <a href={href} className="contact-button-content primary" onClick={onClick}>
    <div className="iconDiv">{icon}</div>
    <div className="text">
      <b className="bold">
        <T id={titleId} />
      </b>
      <br />
      {label}
    </div>
  </a>
);

export default ContactButtonContent;
