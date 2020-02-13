import React from 'react';
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
  const searchParams = `addUser=true&email=${handle}&firstName=${firstName}&lastName=${lastName}`;

  return `${baseUrl}?${searchParams}`;
};

const FrontContactAddUser = ({ contact }) => (
  <Button
    fab
    onClick={() => Front.openUrl(getAddUserUrl(contact))}
    size="small"
    secondary
    className="ml-8"
    tooltip="Créer un compte e-Potek"
  >
    <Icon type="personAdd" />
  </Button>
);

export default FrontContactAddUser;
