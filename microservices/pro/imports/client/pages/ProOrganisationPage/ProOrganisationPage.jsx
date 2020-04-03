import React from 'react';

import T from 'core/components/Translation';

import ProOrganisationPageTabs from './ProOrganisationPageTabs';
import ShareCustomersToggle from './ShareCustomersToggle';

const ProOrganisationPage = ({ currentUser }) => {
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

  let mainOrganisation = organisations[0];
  if (organisations.length > 1) {
    mainOrganisation =
      organisations.find(({ $metadata: { isMain } }) => isMain) ||
      organisations[0];
  }

  const organisation = mainOrganisation;

  return (
    <div className="pro-organisation-page card1 card-top">
      <img
        src={organisation.logo}
        alt={organisation.name}
        className="org-logo"
      />
      <ShareCustomersToggle
        organisation={organisation}
        currentUser={currentUser}
      />
      <div className="flex-col mb-16">
        <label htmlFor="" className="mb-8">
          Code referral de {organisation.name}
        </label>
        <b className="organisation-id">{organisation._id}</b>
      </div>
      <ProOrganisationPageTabs
        organisation={organisation}
        currentUser={currentUser}
      />
    </div>
  );
};
export default ProOrganisationPage;
