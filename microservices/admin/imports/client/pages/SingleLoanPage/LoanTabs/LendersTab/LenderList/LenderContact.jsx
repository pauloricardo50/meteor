//
import React from 'react';

import { CONTACTS_COLLECTION } from 'core/api/constants';
import DropdownMenu from 'core/components/DropdownMenu';
import { lenderLinkOrganisationAndContact } from 'imports/core/api/methods';
import { CollectionIconLink } from 'core/components/IconLink';

const LenderContact = ({ contact, contacts, lenderId }) => (
  <div className="flex center">
    {contact && (
      <CollectionIconLink
        relatedDoc={{ ...contact, collection: CONTACTS_COLLECTION }}
      />
    )}
    <DropdownMenu
      iconType="edit"
      buttonProps={{ size: 'small' }}
      options={[...contacts, { _id: null, name: 'Pas de contact' }].map(
        orgContact => ({
          label: orgContact.name,
          id: orgContact._id,
          onClick: () =>
            lenderLinkOrganisationAndContact.run({
              lenderId,
              contactId: orgContact._id,
              organisationId: null,
            }),
        }),
      )}
    />
  </div>
);

export default LenderContact;
