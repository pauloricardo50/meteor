import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'imports/core/components/Translation/Translation';
import CollectionIconLink from 'imports/core/components/IconLink/CollectionIconLink';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import { createRoute } from 'imports/core/utils/routerUtils';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'organisationName', label: <T id="Forms.organisationName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const makeMapContact = ({ history }) => (contact) => {
  const {
    _id: contactId,
    firstName,
    lastName,
    email,
    phoneNumber,
    organisation,
  } = contact;
  const { name: organisationName } = organisation || {};

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
        raw: organisationName,
        label: organisationName ? (
          <CollectionIconLink
            relatedDoc={{
              ...organisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        ) : (
          "N'est lié à aucune organisation"
        ),
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
    handleClick: (event) => {
      event.stopPropagation();
      history.push(createRoute('/contacts/:contactId', {
        contactId,
      }));
    },
  };
};

export default compose(
  withRouter,
  withProps(({ contacts = [], history }) => ({
    rows: contacts.map(makeMapContact({ history })),
    columnOptions,
  })),
);
