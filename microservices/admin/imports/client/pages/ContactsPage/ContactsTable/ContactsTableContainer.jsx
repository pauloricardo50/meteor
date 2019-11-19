import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation';
import { CollectionIconLink } from 'core/components/IconLink';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'organisationName', label: <T id="Forms.organisationName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const makeMapContact = ({ history }) => contact => {
  const {
    _id: contactId,
    firstName,
    lastName,
    email,
    phoneNumber,
    organisations,
  } = contact;

  return {
    id: contactId,
    columns: [
      {
        raw: firstName,
        label: firstName,
      },
      {
        raw: lastName,
        label: lastName,
      },
      {
        raw: organisations && organisations.length > 0 && organisations[0].name,
        label:
          organisations && organisations.length > 0
            ? organisations.map(organisation => (
                <CollectionIconLink
                  key={organisation._id}
                  relatedDoc={{
                    ...organisation,
                    collection: ORGANISATIONS_COLLECTION,
                  }}
                />
              ))
            : "N'appartient à aucune organisation pour l'instant",
      },
      {
        raw: email,
        label: email,
      },
      {
        raw: phoneNumber,
        label: phoneNumber,
      },
    ],
    handleClick: event => {
      event.stopPropagation();
      history.push(createRoute('/contacts/:contactId', { contactId }));
    },
  };
};

export default compose(
  withRouter,
  withProps(({ contacts = [], history, organisationId }) => ({
    rows: contacts.map(makeMapContact({ history })),
    columnOptions,
    insertContactModel: organisationId
      ? { organisations: [{ _id: organisationId }] }
      : {},
  })),
);
