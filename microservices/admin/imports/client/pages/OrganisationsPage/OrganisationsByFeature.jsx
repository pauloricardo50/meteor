// @flow
import React from 'react';

import T from 'core/components/Translation';
import Organisation from './Organisation';

type OrganisationsByFeatureProps = {
  feature: String,
  organisations: Array<Object>,
};

const OrganisationsByFeature = ({
  organisations = [],
  feature,
}: OrganisationsByFeatureProps) => {
  const filteredOrganisations = organisations
    .filter(({ features = [] }) =>
      feature ? features.includes(feature) : features.length === 0,
    )
    .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

  return filteredOrganisations.length ? (
    <div className="organisations-by-feature">
      <h3>{feature ? <T id={`Forms.features.${feature}`} /> : 'Autre'}</h3>
      <div className="organisations">
        {filteredOrganisations.map(org => (
          <Organisation organisation={org} key={org._id} />
        ))}
      </div>
    </div>
  ) : null;
};

export default OrganisationsByFeature;
