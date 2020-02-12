import React, { useContext } from 'react';
import groupBy from 'lodash/groupBy';

import { Money } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import DialogSimple from 'core/components/DialogSimple';
import CurrentUserContext from 'core/containers/CurrentUserContext';
import { LOANS_COLLECTION, REVENUES_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
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
      title={`Revenus sans commission de ${orgName}`}
    >
      <div className="flex-col">
        {revenues.map(
          ({ loan }) =>
            loan && (
              <CollectionIconLink
                key={loan._id}
                relatedDoc={{
                  ...loan,
                  collection: LOANS_COLLECTION,
                }}
              />
            ),
        )}
      </div>
    </DialogSimple>
  </div>
);

const RevenuesWithoutCommissions = props => {
  const currentUser = useContext(CurrentUserContext);
  const { data: revenues = [], loading } = useStaticMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: {
        $or: [
          { organisationLinks: { $exists: false } },
          { organisationLinks: { $size: 0 } },
        ],
      },
      loan: {
        name: 1,
        user: { referredByOrganisation: { name: 1, commissionRates: 1 } },
        borrowers: { name: 1 },
        hasPromotion: 1,
      },
      organisationLinks: 1,
      amount: 1,
      assigneeLink: 1,
    },
  });

  const filteredRevenues = revenues.filter(
    ({
      organisationLinks,
      loan: { user: { referredByOrganisation } = {}, hasPromotion } = {},
    }) => {
      if (
        referredByOrganisation &&
        referredByOrganisation.name &&
        (!organisationLinks || organisationLinks.length === 0) &&
        !hasPromotion
      ) {
        return (
          referredByOrganisation.commissionRates &&
          referredByOrganisation.commissionRates.length > 0
        );
      }
      return false;
    },
  );

  const ownRevenues = filteredRevenues.filter(
    ({ assigneeLink }) =>
      assigneeLink && currentUser && assigneeLink._id === currentUser._id,
  );

  const groupedRevenues = groupBy(
    filteredRevenues,
    'loan.user.referredByOrganisation.name',
  );

  return (
    <StatItem
      title="Revenus sans commission"
      value={!loading && filteredRevenues.length}
      top={
        <DialogSimple
          buttonProps={{
            label: 'Afficher organisations concernées',
            raised: false,
            primary: true,
          }}
          title="Revenus sans commission"
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

export default RevenuesWithoutCommissions;
