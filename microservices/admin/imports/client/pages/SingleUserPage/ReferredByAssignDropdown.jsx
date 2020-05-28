import React from 'react';

import DropdownMenu from 'core/components/DropdownMenu';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

import ReferredByAssignDropdownContainer from './ReferredByAssignDropdownContainer';

const ReferredByAssignDropdown = ({ options, referredByUser }) => (
  <div className="flex-row center">
    <span className="flex-row center mr-8">
      {referredByUser ? (
        <CollectionIconLink relatedDoc={referredByUser} />
      ) : (
        'Personne'
      )}
    </span>
    <DropdownMenu iconType="personAdd" options={options} tooltip="Référé par" />
  </div>
);

export default ReferredByAssignDropdownContainer(ReferredByAssignDropdown);
