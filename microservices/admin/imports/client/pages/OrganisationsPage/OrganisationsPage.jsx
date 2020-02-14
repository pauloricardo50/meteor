import React from 'react';
import { Helmet } from 'react-helmet';

import Icon from 'core/components/Icon';
import {
  ORGANISATIONS_COLLECTION,
  ORGANISATION_FEATURES,
} from 'core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import OrganisationsPageContainer from './OrganisationsPageContainer';
import OrganisationAdder from './OrganisationAdder';
import OrganisationFilters from './OrganisationFilters';
import OrganisationsByFeature from './OrganisationsByFeature';

const OrganisationsPage = ({
  insertOrganisation,
  organisations,
  filters,
  setFilters,
}) => (
  <div className="card1 card-top organisations-page">
    <Helmet>
      <title>Organisations</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[ORGANISATIONS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <span>Organisations</span>
    </h1>

    <OrganisationAdder insertOrganisation={insertOrganisation} />

    <OrganisationFilters filters={filters} setFilters={setFilters} />

    {[...Object.keys(ORGANISATION_FEATURES), null].map(feature => (
      <OrganisationsByFeature
        organisations={organisations}
        feature={feature}
        key={feature || 'other'}
      />
    ))}
  </div>
);

export default OrganisationsPageContainer(OrganisationsPage);
