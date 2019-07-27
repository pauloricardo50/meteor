// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import Icon from 'core/components/Icon';
import { ORGANISATIONS_COLLECTION } from 'core/api/constants';
import collectionIcons from 'core/arrays/collectionIcons';
import OrganisationsPageContainer from './OrganisationsPageContainer';
import Organisation from './Organisation';
import OrganisationAdder from './OrganisationAdder';
import OrganisationFilters from './OrganisationFilters';

type OrganisationsPageProps = {
  insertOrganisation: Function,
  organisations: Array<Object>,
  filters: Object,
  setFilters: Function,
};

const OrganisationsPage = ({
  insertOrganisation,
  organisations,
  filters,
  setFilters,
}: OrganisationsPageProps) => (
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

    <div className="organisations">
      {organisations
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB))
        .map(org => (
          <Organisation organisation={org} key={org._id} />
        ))}
    </div>
  </div>
);

export default OrganisationsPageContainer(OrganisationsPage);
