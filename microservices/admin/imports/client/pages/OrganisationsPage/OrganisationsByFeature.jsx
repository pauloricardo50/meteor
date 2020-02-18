import React from 'react';
import groupBy from 'lodash/groupBy';

import T from 'core/components/Translation';
import Organisation from './Organisation';

const OrganisationsByFeature = ({ organisations = [], feature }) => {
  const filteredOrganisations = organisations
    .filter(({ features = [] }) =>
      feature ? features.includes(feature) : features.length === 0,
    )
    .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

  const groupedOrganisations = groupBy(filteredOrganisations, 'type');

  return filteredOrganisations.length ? (
    <div className="organisations-by-feature">
      <h2>{feature ? <T id={`Forms.features.${feature}`} /> : 'Autre'}</h2>
      {Object.keys(groupedOrganisations).map(type => {
        const orgs = groupedOrganisations[type];
        return (
          <div key={type} style={{ marginBottom: 16 }}>
            <h3>
              <T id={`Forms.type.${type}`} />
            </h3>
            <div className="organisations">
              {orgs.map(org => (
                <Organisation organisation={org} key={org._id} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  ) : null;
};

export default OrganisationsByFeature;
