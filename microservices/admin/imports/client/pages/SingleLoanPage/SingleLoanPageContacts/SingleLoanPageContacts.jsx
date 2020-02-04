//      
import React from 'react';

import Icon from 'core/components/Icon';
import colors from 'core/config/colors';
import useLoanContacts from 'core/components/AdminNote/useLoanContacts';

                                      

const Contact = ({
  name,
  email = '-',
  title = 'Contact perso',
  icon,
  phoneNumber = '-',
}) => (
  <div key={email} className="single-loan-page-contacts-contact">
    <div className="flex center-align">
      <Icon type={icon} className="mr-4" />
      <h4>
        {name} <small className="secondary">{title}</small>
      </h4>
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

const SingleLoanPageContacts = ({ loanId }                             ) => {
  const { loading, contacts } = useLoanContacts(loanId);
  return (
    <div className="single-loan-page-contacts card1 card-top">
      <h3>Contacts</h3>

      <div className="scroll-wrapper">
        {!loading &&
          contacts.map(contact => <Contact {...contact} key={contact.name} />)}
      </div>
      {!loading && contacts.length === 0 && (
        <h2 className="secondary text-center">Pas de contacts</h2>
      )}
    </div>
  );
};

export default SingleLoanPageContacts;
