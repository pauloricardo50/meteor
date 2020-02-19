import React from 'react';
import Button from '../../core/components/Button';
import Icon from '../../core/components/Icon';

const { Front, subdomains } = window;

const getOptions = ({ contact }) => {
  const { loans = [] } = contact;

  return [
    ...loans.map(loan => ({
      title: `Ajouter une note sur le dossier "${loan.name}"`,
      loan,
    })),
  ];
};

const openFrontItemList = props => () => {
  const items = getOptions(props);
  const baseUrl = subdomains.admin;

  if (items.length === 1) {
    const [{ loan }] = items;
    return Front.openUrl(`${baseUrl}/loans/${loan._id}?addNote=true`);
  }

  Front.fuzzylist({ items: getOptions(props) }, ({ loan }) => {
    if (loan) {
      return Front.openUrl(`${baseUrl}/loans/${loan._id}?addNote=true`);
    }
  });
};

const FrontContactNoteAdder = props => {
  const { contact } = props;

  return contact?.loans?.length ? (
    <Button
      label="Note"
      primary
      raised
      onClick={openFrontItemList(props)}
      small
      icon={<Icon type="add" />}
    />
  ) : null;
};

export default FrontContactNoteAdder;
