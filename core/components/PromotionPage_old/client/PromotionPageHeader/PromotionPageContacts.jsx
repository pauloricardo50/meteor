// @flow
import React from 'react';

import T from '../../../Translation';

type PromotionPageContactsProps = {};

const PromotionPageContacts = ({
  contacts = [],
}: PromotionPageContactsProps) => {
  if (contacts.length === 0) {
    return <div style={{ height: '150px' }} />;
  }

  return (
    <div className="contacts animated fadeIn delay-400">
      <h3>
        <T
          id="PromotionPageHeader.contacts"
          values={{ multipleContacts: contacts.length > 1 }}
        />
      </h3>

      <div className="list">
        {contacts.map(({ name: contactName, phoneNumber, title, email }) => (
          <div className="contact" key={email}>
            <h4 className="name">{contactName}</h4>
            <span className="title secondary">{title}</span>
            {phoneNumber && <span className="phone-number">{phoneNumber}</span>}
            {email && <span className="email">{email}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionPageContacts;
