import React, { useContext } from 'react';
import groupBy from 'lodash/groupBy';

import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { Money } from 'core/components/Translation';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const OrgItem = ({ orgName, revenues }) => (
  <div key={orgName} className="flex center-align sb mb-16">
    <div>
      <h4>{orgName}</h4>
      <span className="mr-8">{revenues.length} revenus</span>
      <span>
        <Money value={revenues.reduce((t, r) => t + r.amount, 0)} />
      </span>
    </div>
    <DialogSimple
      buttonProps={{ label: 'Afficher', raised: false }}
      title={`Revenus avec des commissions pas nécessaire de ${orgName}`}
    >
      <div className="flex-col">
        {revenues.map(({ loan, insuranceRequest, insurance }) => {
          const selectedDocument = insurance || insuranceRequest || loan;
          return (
            selectedDocument && (
              <CollectionIconLink
                key={selectedDocument._id}
                relatedDoc={selectedDocument}
              />
            )
          );
        })}
      </div>
    </DialogSimple>
  </div>
);

const RevnuesWithUnnecessaryCommissions = ({ showAll }) => {
  const currentUser = useContext(CurrentUserContext);
  const { data: revenues = [], loading } = useStaticMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: {
        organisationLinks: { $exists: true },
      },
      organisations: {
        name: 1,
        commissionRates: { type: 1 },
        enabledCommissions: 1,
      },
      amount: 1,
      assigneeLink: 1,
      type: 1,
      loan: { name: 1, borrowers: { name: 1 } },
      insuranceRequest: { name: 1, borrowers: { name: 1 } },
      insurance: {
        name: 1,
        borrower: { name: 1 },
        insuranceRequest: { name: 1 },
      },
    },
    refetchOnMethodCall: false,
  });

  const filteredRevenues = revenues.filter(
    ({ organisations = [], type: revenueType }) => {
      if (organisations.length) {
        return organisations.some(
          ({ enabledCommissions = [] }) =>
            !enabledCommissions.includes(revenueType),
        );
      }

      return false;
    },
  );

  const ownRevenues = filteredRevenues.filter(
    ({ assigneeLink }) =>
      assigneeLink && currentUser && assigneeLink._id === currentUser._id,
  );

  const groupedRevenues = groupBy(filteredRevenues, 'organisations[0].name');

  if (!showAll && !filteredRevenues.length) {
    return null;
  }

  return (
    <StatItem
      title="Revenus avec des commissions pas nécessaires"
      value={!loading && filteredRevenues.length}
      top={
        <DialogSimple
          buttonProps={{
            label: 'Afficher organisations concernées',
            raised: false,
            primary: true,
          }}
          title="Revenus avec des commissions pas nécessaires"
        >
          <div className="flex-col">
            {!loading &&
              Object.keys(groupedRevenues).map(orgName => {
                const revs = groupedRevenues[orgName];

                return (
                  <OrgItem key={orgName} revenues={revs} orgName={orgName} />
                );
              })}
          </div>
        </DialogSimple>
      }
      positive={ownRevenues.length === 0}
      increment={`Dont ${ownRevenues.length} à moi`}
    />
  );
};

export default RevnuesWithUnnecessaryCommissions;
