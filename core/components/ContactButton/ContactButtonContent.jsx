// @flow
import React from 'react';
import T from 'core/components/Translation';

type ContactButtonContentProps = {
  titleId: string,
  icon: React.Node,
  href: string,
  label: string,
};

const ContactButtonContent = ({
  titleId,
  icon,
  href,
  label,
}: ContactButtonContentProps) => (
  <div className="contact-button-content">
    <div className="iconDiv">{icon}</div>
    <div className="text">
      <p className="bold">
        <T id={titleId} />
      </p>
      <a href={href} className="primary">
        {label}
      </a>
    </div>
  </div>
);

export default ContactButtonContent;
