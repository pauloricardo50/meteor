import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import TooltipArray from 'core/components/TooltipArray';
import T from 'core/components/Translation/Translation';
import { createRoute } from 'core/utils/routerUtils';

const columnOptions = [
  { id: 'firstName', label: <T id="Forms.firstName" /> },
  { id: 'lastName', label: <T id="Forms.lastName" /> },
  { id: 'organisationName', label: <T id="Forms.organisationName" /> },
  { id: 'email', label: <T id="Forms.email" /> },
  { id: 'phoneNumber', label: <T id="Forms.phoneNumber" /> },
];

const makeMapUser = ({ history }) => user => {
  const {
    _id: userId,
    firstName,
    lastName,
    email,
    phoneNumber,
    organisations = [],
  } = user;

  return {
    id: userId,
    columns: [
      firstName,
      lastName,
      {
        raw: !!organisations.length && organisations[0].name,
        label: !!organisations.length && (
          <TooltipArray
            items={organisations.map(organisation => (
              <CollectionIconLink
                key={organisation._id}
                relatedDoc={{
                  ...organisation,
                  collection: ORGANISATIONS_COLLECTION,
                }}
              />
            ))}
            title="Organisations"
          />
        ),
      },
      email,
      phoneNumber,
    ],
    handleClick: event => {
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
