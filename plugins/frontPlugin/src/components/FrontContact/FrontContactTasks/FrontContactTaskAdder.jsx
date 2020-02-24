import React from 'react';
import queryString from 'query-string';

import Button from '../../../core/components/Button';
import Icon from '../../../core/components/Icon';

const { Front, subdomains } = window;

const getTaskUrl = ({
  collection,
  isEpotekResource,
  contact,
  loan,
  frontLink,
}) => {
  const baseUrl = subdomains.admin;
  const searchParams = queryString.stringify({
    ...(isEpotekResource
      ? { addTask: true }
      : {
          addUnlinkedTask: true,
          title: contact?.display_name || contact?.handle,
        }),
    description: `Front: ${frontLink}`,
  });

  const id = contact?._id || loan?._id;

  if (collection) {
    return `${baseUrl}/${collection}/${id}?${searchParams}`;
  }

  return `${baseUrl}?${searchParams}`;
};

const getOptionTitle = ({ collection, object }) => {
  switch (collection) {
    case 'contacts':
      return `Ajouter une tâche sur le contact "${object.name}"`;
    case 'loans':
      return `Ajouter une tâche sur le dossier "${object.name}"`;
    case 'users':
      return `Ajouter une tâche sur le compte "${object.name}"`;
    default:
      return `Ajouter une tâche relative à 
          "${object.name || object.display_name || object.handle}"`;
  }
};

const getOptions = ({ collection, contact }) => {
  const { loans = [] } = contact;

  return [
    {
      title: getOptionTitle({ collection, object: contact }),
      collection,
      object: contact,
    },
    ...loans.map(loan => ({
      title: getOptionTitle({ collection: 'loans', object: loan }),
      collection: 'loans',
      object: loan,
    })),
  ];
};

const openFrontItemList = props => () => {
  const { conversation: { link: frontLink } = {}, isEpotekResource } = props;
  const items = getOptions(props);

  if (items.length === 1) {
    const [{ collection, object }] = items;
    return Front.openUrl(
      getTaskUrl({
        collection,
        isEpotekResource,
        contact: object,
        frontLink,
      }),
    );
  }

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
    label="Tâche"
    primary
    raised
    onClick={openFrontItemList(props)}
    small
    icon={<Icon type="add" />}
  />
);

export default FrontContactTaskAdder;
