// @flow
import React from 'react';

import T from 'core/components/Translation';
import ProOrganisationPageTabs from './ProOrganisationPageTabs';

type ProOrganisationPageProps = {};

const ProOrganisationPage = ({ currentUser }: ProOrganisationPageProps) => {
  const { organisations } = currentUser;

  if (!organisations || organisations.length === 0) {
    return (
      <div className="card1 card-top">
        <h1>
          <T id="ProOrganisationPage.empty" />
        </h1>
        <p className="description">
          <T id="ProOrganisationPage.empty.description" />
        </p>
      </div>
    );
  }

  const organisation = organisations[0];

  return (
    <div className="pro-organisation-page card1 card-top">
      <img
        src={organisation.logo}
        alt={organisation.name}
        className="org-logo"
      />
      <ProOrganisationPageTabs
        organisation={organisation}
        currentUser={currentUser}
      />
    </div>
  );
};
export default ProOrganisationPage;
