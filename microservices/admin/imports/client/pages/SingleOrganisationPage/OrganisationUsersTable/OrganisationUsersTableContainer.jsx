import React from 'react';
import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router-dom';

import T from 'core/components/Translation/Translation';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import { createRoute } from 'core/utils/routerUtils';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'organisationName', label: <T id="Forms.organisationName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const makeMapUser = ({ history }) => (user) => {
  const {
    _id: userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    organisations,
  } = user;

  return {
    id: userId,
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
          organisations
          && !!organisations.length
          && organisations.map(organisation => (
            <CollectionIconLink
              key={organisation._id}
              relatedDoc={{
                ...organisation,
                collection: ORGANISATIONS_COLLECTION,
              }}
            />
          )),
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
      history.push(createRoute('/users/:userId', { userId }));
    },
  };
};

export default compose(
  withRouter,
  withProps(({ users = [], history }) => ({
    rows: users.map(makeMapUser({ history })),
    columnOptions,
  })),
);
