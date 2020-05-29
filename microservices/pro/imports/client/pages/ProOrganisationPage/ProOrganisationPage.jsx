import React from 'react';

import { proUser } from 'core/api/users/queries';
import Loading from 'core/components/Loading/Loading';
import T from 'core/components/Translation';
import useMeteorData from 'core/hooks/useMeteorData';
import { getMainOrganisation } from 'core/utils/userFunctions';

import ProOrganisationPageTabs from './ProOrganisationPageTabs';
import ShareCustomersToggle from './ShareCustomersToggle';

const ProOrganisationPage = () => {
  const { data: currentUser, loading } = useMeteorData({
    query: proUser,
    params: {
      $body: {
        organisations: {
          name: 1,
          users: { name: 1, email: 1, phoneNumber: 1 },
          commissionRates: { _id: 1 },
          logo: 1,
        },
      },
    },
    type: 'single',
  });

  if (loading) {
    return <Loading />;
  }
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

  const mainOrganisation = getMainOrganisation(currentUser);

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
