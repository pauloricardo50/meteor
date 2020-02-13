import React from 'react';
import cx from 'classnames';

import FrontContactAddUser from './FrontContactAddUser';
import FrontContactTaskAdder from './FrontContactTaskAdder';

const { Front, subdomains } = window;

const getContactInitials = contact => {
  const { name: rawName } = contact;
  const name = rawName.replace(/[@]/, '');
  const [firstName, lastName] = [
    name.split(' ')[0],
    name
      .split(' ')
      .slice(1)
      .join(' '),
  ];

  return [firstName[0], lastName[0]].join('');
};

const FrontContactHeader = ({
  contact,
  isEpotekResource,
  collection,
  conversation,
}) => {
  const { name, email, avatar } = contact;

  return (
    <div className="front-contact-header">
      <div className="front-contact-header-avatar">
        {avatar ? (
          <img src={avatar} alt={name} width={100} height={100} />
        ) : (
          <span>{getContactInitials(contact)}</span>
        )}
        {!isEpotekResource && <FrontContactAddUser contact={contact} />}
      </div>
      <h3
        className={cx({ link: isEpotekResource })}
        onClick={() => {
          if (isEpotekResource) {
            Front.openUrl(`${subdomains.admin}/${collection}/${contact._id}`);
          }
        }}
      >
        {name}
      </h3>
      <h4>{email}</h4>
      <FrontContactTaskAdder
        collection={collection}
        isEpotekResource={isEpotekResource}
        contact={contact}
        conversation={conversation}
      />
    </div>
  );
};

export default FrontContactHeader;
