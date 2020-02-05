//
import React from 'react';

const mergeInvitedByWithContacts = ({ invitedByUser = {}, contacts = [] }) => {
  if (!Object.keys(invitedByUser).length) {
    return contacts;
  }
  const { email } = invitedByUser;

  if (contacts.some(({ email: contactEmail }) => contactEmail === email)) {
    return contacts;
  }

  const organisation =
    invitedByUser &&
    invitedByUser.organisations &&
    !!invitedByUser.organisations.length &&
    invitedByUser.organisations[0];

  const title = organisation && organisation.$metadata.title;

  return [
    ...contacts,
    { ...invitedByUser, title: title || 'Courtier immobilier' },
  ];
};

const PromotionPartners = ({
  promotion: { documents: { logos = [] } = {}, contacts = [] },
  invitedByUser,
}) => {
  const mergedContacts = mergeInvitedByWithContacts({
    contacts,
    invitedByUser,
  });

  return (
    <div className="promotion-partners animated fadeIn">
      {mergedContacts.length > 0 && (
        <div className="contacts">
          {mergedContacts.map(
            ({ name: contactName, phoneNumber, title, email }) => (
              <div className="contact" key={email}>
                <h4 className="name">{contactName}</h4>
                <span className="title secondary">{title}</span>
                {phoneNumber && (
                  <span className="phone-number">{phoneNumber}</span>
                )}
                {email && <span className="email">{email}</span>}
              </div>
            ),
          )}
        </div>
      )}

      {logos.length > 0 && (
        <div className="logos">
          {logos.map(logo => (
            <div className="logo card1 card-top" key={logo.Key}>
              <div className="logo-wrapper">
                <img src={logo.url} alt="" />
              </div>
              <p className="text-center bold">
                {logo.name
                  .split('.')
                  .slice(0, -1)
                  .join('.')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromotionPartners;
