import React, { useContext } from 'react';
import groupBy from 'lodash/groupBy';

import { COMMISSION_RATES_TYPE } from 'core/api/commissionRates/commissionRateConstants';
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
      title={`Revenus sans commission de ${orgName}`}
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

const RevenuesWithoutCommissions = ({ showAll }) => {
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
        user: {
          referredByOrganisation: {
            name: 1,
            commissionRates: { _id: 1, type: 1 },
            enabledCommissionTypes: 1,
          },
        },
        borrowers: { name: 1 },
        hasPromotion: 1,
      },
      organisationLinks: 1,
      amount: 1,
      assigneeLink: 1,
      type: 1,
      insuranceRequest: {
        name: 1,
        borrowers: { name: 1 },
        user: {
          referredByOrganisation: {
            name: 1,
            commissionRates: { _id: 1, type: 1 },
            enabledCommissionTypes: 1,
          },
        },
      },
      insurance: {
        name: 1,
        borrower: { name: 1 },
        insuranceRequest: {
          name: 1,
          user: {
            referredByOrganisation: {
              name: 1,
              commissionRates: { _id: 1, type: 1 },
              enabledCommissionTypes: 1,
            },
          },
        },
      },
    },
    refetchOnMethodCall: false,
  });

  const filteredRevenues = revenues
    .map(revenue => {
      const { loan, insurance, insuranceRequest } = revenue;

      const relatedDoc =
        insurance?.insuranceRequest || insuranceRequest || loan || {};
      const {
        user: { referredByOrganisation } = {},
        hasPromotion,
      } = relatedDoc;

      return { ...revenue, referredByOrganisation, hasPromotion };
    })
    .filter(
      ({
        organisationLinks,
        type: revenueType,
        referredByOrganisation,
        hasPromotion,
      }) => {
        if (
          referredByOrganisation?.name &&
          (!organisationLinks || organisationLinks.length === 0) &&
          !hasPromotion
        ) {
          return (
            referredByOrganisation.commissionRates?.length > 0 &&
            referredByOrganisation.commissionRates.some(
              ({ type }) => type === COMMISSION_RATES_TYPE.COMMISSIONS,
            ) &&
            referredByOrganisation.enabledCommissionTypes?.includes(revenueType)
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
    'referredByOrganisation.name',
  );

  if (!showAll && !filteredRevenues.length) {
    return null;
  }

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
