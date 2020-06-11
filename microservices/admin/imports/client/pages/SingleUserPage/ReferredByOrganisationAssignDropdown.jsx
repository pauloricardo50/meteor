import React from 'react';

import DropdownMenu from 'core/components/DropdownMenu';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

import ReferredByOrganisationAssignDropdownContainer from './ReferredByOrganisationAssignDropdownContainer';

const ReferredByOrganisationAssignDropdown = ({
  options,
  referredByOrganisation,
}) => (
  <div className="flex-row center">
    <span className="flex-row center mr-8">
      {referredByOrganisation ? (
        <>
          <CollectionIconLink relatedDoc={referredByOrganisation} />
        </>
      ) : (
        'Aucune'
      )}
    </span>
    <DropdownMenu
      iconType="groupAdd"
      options={options}
      tooltip="Référé par l'organisation"
    />
  </div>
);

export default ReferredByOrganisationAssignDropdownContainer(
  ReferredByOrganisationAssignDropdown,
);
