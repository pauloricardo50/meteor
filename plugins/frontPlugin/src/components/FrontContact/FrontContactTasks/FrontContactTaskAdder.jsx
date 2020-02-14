import React from 'react';
import Button from '../../../core/components/Button';

const { Front, subdomains } = window;

const getTaskDescription = frontLink =>
  encodeURIComponent(`Front: ${frontLink}`);

const getTaskUrl = ({
  collection,
  isEpotekResource,
  contact,
  loan,
  frontLink,
}) => {
  const taskDescription = getTaskDescription(frontLink);
  const baseUrl = subdomains.admin;
  const searchParams = `addTask=true&description=${taskDescription}`;

  if (!isEpotekResource) {
    return `${baseUrl}?${searchParams}&title=${contact?.display_name ||
      contact?.handle}`;
  }

  const id = contact?._id || loan?._id;

  switch (collection) {
    case 'users':
      return `${baseUrl}/users/${id}?${searchParams}`;
    case 'contacts':
      return `${baseUrl}/contacts/${id}?${searchParams}`;
    case 'loans':
      return `${baseUrl}/loans/${id}?${searchParams}`;
    default:
      return `${baseUrl}?${searchParams}`;
  }
};

const getOptions = ({ collection, contact }) => {
  const { loans = [] } = contact;

  return [
    {
      title: contact.name || contact.display_name || contact.handle,
      collection,
      object: contact,
    },
    ...loans.map(loan => ({
      title: loan.name,
      collection: 'loans',
      object: loan,
    })),
  ];
};

const openFrontItemList = props => () => {
  const { conversation: { link: frontLink } = {}, isEpotekResource } = props;

  Front.fuzzylist({ items: getOptions(props) }, ({ collection, object }) => {
    if (object) {
      if (collection === 'loans') {
        return Front.openUrl(
          getTaskUrl({
            collection: 'loans',
            isEpotekResource: true,
            loan: object,
            frontLink,
          }),
        );
      }

      return Front.openUrl(
        getTaskUrl({
          collection,
          isEpotekResource,
          contact: object,
          frontLink,
        }),
      );
    }
  });
};

const FrontContactTaskAdder = props => (
  <Button
    label="+ Tâche"
    primary
    raised
    onClick={openFrontItemList(props)}
    small
  />
);

export default FrontContactTaskAdder;
