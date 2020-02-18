import React from 'react';

import DropdownMenu from 'core/components/DropdownMenu';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { USERS_COLLECTION } from 'core/api/constants';
import ReferredByAssignDropdownContainer from './ReferredByAssignDropdownContainer';

const ReferredByAssignDropdown = ({ options, referredByUser }) => (
  <div className="flex-row center space-children">
    <span className="flex-row center space-children">
      Référé par&nbsp;
      {referredByUser ? (
        <CollectionIconLink
          relatedDoc={{ ...referredByUser, collection: USERS_COLLECTION }}
        />
      ) : (
        'personne'
      )}
    </span>
    <DropdownMenu iconType="personAdd" options={options} tooltip="Référé par" />
  </div>
);

export default ReferredByAssignDropdownContainer(ReferredByAssignDropdown);
