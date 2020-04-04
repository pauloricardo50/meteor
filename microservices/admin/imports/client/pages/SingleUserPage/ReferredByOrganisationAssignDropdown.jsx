import React from 'react';

import DropdownMenu from 'core/components/DropdownMenu';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';

import ReferredByOrganisationAssignDropdownContainer from './ReferredByOrganisationAssignDropdownContainer';

const ReferredByOrganisationAssignDropdown = ({
  options,
  referredByOrganisation,
}) => (
  <div className="flex-row center space-children">
    {referredByOrganisation ? (
      <span className="flex-row center space-children">
        Référé par l'organisation&nbsp;
        <CollectionIconLink relatedDoc={referredByOrganisation} />
      </span>
    ) : (
      <span className="flex-row center space-children">
        Référé par aucune organisation
      </span>
    )}
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
