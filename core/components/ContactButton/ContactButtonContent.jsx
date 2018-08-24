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
