import React from 'react';
import Button from '../../../core/components/Button';

const { Front, subdomains } = window;

const getOptions = ({ contact }) => {
  const { loans = [] } = contact;

  return [
    ...loans.map(loan => ({
      title: loan.name,
      loan,
    })),
  ];
};

const openFrontItemList = props => () => {
  Front.fuzzylist({ items: getOptions(props) }, ({ loan }) => {
    const baseUrl = subdomains.admin;

    if (loan) {
      return Front.openUrl(`${baseUrl}/loans/${loan._id}?addNote=true`);
    }
  });
};

const FrontContactNoteAdder = props => {
  const { contact } = props;

  return contact?.loans?.length ? (
    <Button
      label="+ Note"
      primary
      raised
      onClick={openFrontItemList(props)}
      small
    />
  ) : null;
};

export default FrontContactNoteAdder;
