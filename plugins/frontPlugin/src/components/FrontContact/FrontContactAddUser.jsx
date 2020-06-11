import React from 'react';
import queryString from 'query-string';

import Button from '../../core/components/Button';
import Icon from '../../core/components/Icon';

const { Front, subdomains } = window;

const getUrl = ({ contact, type }) => {
  const { handle, name } = contact;
  const [firstName, lastName] = [
    name.split(' ')[0],
    name
      .split(' ')
      .slice(1)
      .join(' '),
  ];
  const baseUrl =
    type === 'user' ? subdomains.admin : `${subdomains.admin}/other/contacts`;
  const searchParams = queryString.stringify({
    ...(type === 'user' ? { addUser: true } : {}),
    ...(type === 'contact' ? { addContact: true } : {}),
    email: handle,
    firstName,
    lastName,
  });

  return `${baseUrl}?${searchParams}`;
};

const FrontContactAddUser = ({ contact }) => (
  <div className="front-contact-add-user space-children">
    <hr />
    <h2 className="secondary">Adresse email pas trouvée dans e-Potek</h2>
    <Button
      onClick={() => Front.openUrl(getUrl({ contact, type: 'user' }))}
      secondary
      raised
      icon={<Icon type="personAdd" />}
    >
      Créer un compte e-Potek
    </Button>
    <Button
      onClick={() => Front.openUrl(getUrl({ contact, type: 'contact' }))}
      secondary
      raised
      icon={<Icon type="personAdd" />}
    >
      Créer un contact e-Potek
    </Button>
  </div>
);

export default FrontContactAddUser;
