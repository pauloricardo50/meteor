// @flow
import React from 'react';

import {
  LENDERS_COLLECTION,
  ORGANISATIONS_COLLECTION,
  CONTACTS_COLLECTION,
} from 'core/api/constants';
import StatusLabel from 'core/components/StatusLabel';
import { CollectionIconLink } from 'core/components/IconLink';
import DropdownMenu from 'core/components/DropdownMenu';
import { lenderLinkOrganisationAndContact } from 'imports/core/api/methods';

type LenderProps = {};

const Lender = ({
  lender: { organisation, status, contact, _id: lenderId },
}: LenderProps) => {
  // Organisation is undefined at the start
  if (!organisation) {
    return null;
  }

  const { contacts = [] } = organisation;

  return (
    <div className="lender">
      <div className="flex center">
        <h3>
          <CollectionIconLink
            relatedDoc={{
              ...organisation,
              collection: ORGANISATIONS_COLLECTION,
            }}
          />
        </h3>
        <StatusLabel status={status} collection={LENDERS_COLLECTION} />
      </div>
      <div className="flex center">
        {contact && (
          <CollectionIconLink
            relatedDoc={{ ...contact, collection: CONTACTS_COLLECTION }}
          />
        )}
        <DropdownMenu
          iconType="edit"
          options={[...contacts, { _id: null, name: 'Pas de contact' }].map(orgContact => ({
            label: orgContact.name,
            id: orgContact._id,
            onClick: () =>
              lenderLinkOrganisationAndContact.run({
                lenderId,
                contactId: orgContact._id,
                organisationId: null,
              }),
          }))}
        />
      </div>
    </div>
  );
};

export default Lender;
