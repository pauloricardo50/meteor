import React from 'react';
import queryString from 'query-string';

import Button from '../../core/components/Button';
import Icon from '../../core/components/Icon';

const { Front, subdomains } = window;

const getAddUserUrl = contact => {
  const { handle, name } = contact;
  const [firstName, lastName] = [
    name.split(' ')[0],
    name
      .split(' ')
      .slice(1)
      .join(' '),
  ];
  const baseUrl = subdomains.admin;
  const searchParams = queryString.stringify({
    addUser: true,
    email: handle,
    firstName,
    lastName,
  });

  return `${baseUrl}?${searchParams}`;
};

const FrontContactAddUser = ({ contact }) => (
  <div className="front-contact-add-user">
    <hr />
    <h2 className="secondary">Adresse email pas trouvée dans e-Potek</h2>
    <Button
      onClick={() => Front.openUrl(getAddUserUrl(contact))}
      secondary
      raised
      icon={<Icon type="personAdd" />}
    >
      Créer un compte e-Potek
    </Button>
  </div>
);

export default FrontContactAddUser;
