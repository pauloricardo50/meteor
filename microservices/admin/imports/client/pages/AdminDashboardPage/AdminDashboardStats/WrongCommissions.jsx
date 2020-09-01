import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import {
  COMMISSION_STATUS,
  REVENUES_COLLECTION,
} from 'core/api/revenues/revenueConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { Percent } from 'core/components/Translation';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const WrongCommissions = ({ showAll }) => {
  const { data: revenues = [] } = useStaticMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: { 'organisationLinks.status': COMMISSION_STATUS.TO_BE_PAID },
      organisationLinks: 1,
      loan: { name: 1 },
      insuranceRequest: { name: 1 },
    },
    refetchOnMethodCall: false,
  });
  const organisationsToFetch = revenues.reduce(
    (arr, { organisationLinks }) => [
      ...arr,
      ...organisationLinks.map(({ _id }) => _id),
    ],
    [],
  );
  const { data: organisations = [] } = useStaticMeteorData(
    {
      query: !!organisationsToFetch.length && ORGANISATIONS_COLLECTION,
      params: {
        $filters: { _id: { $in: [...new Set([...organisationsToFetch])] } },
        commissionRate: 1,
        name: 1,
      },
    },
    [organisationsToFetch.length],
  );

  const revenuesWithProblems = revenues.filter(({ organisationLinks }) => {
    const hasWrongCommission = organisationLinks.some(
      ({ _id: organisationId, commissionRate }) => {
        const organisation = organisations.find(
          ({ _id }) => _id === organisationId,
        );
        return organisation
          ? commissionRate !== organisation.commissionRate
          : false;
      },
    );
    return hasWrongCommission;
  });

  if (!showAll && !revenuesWithProblems.length) {
    return null;
  }

  return (
    <StatItem
      title="Fausses commissions"
      value={revenuesWithProblems.length}
      positive={revenuesWithProblems.length === 0}
      top={
        <DialogSimple
          buttonProps={{
            label: 'Afficher dossiers concernés',
            raised: false,
            primary: true,
          }}
          closeOnly
          maxWidth="lg"
          title="Fausses commissions"
        >
          <div className="flex-col">
            {revenuesWithProblems.map(
              ({ _id, organisationLinks, loan, insuranceRequest }) => {
                const [{ commissionRate }] = organisationLinks;
                const organisation = organisations.find(
                  ({ _id: orgId }) => orgId === organisationLinks[0]._id,
                );
                if (loan) {
                  return (
                    <div className="flex-col" key={_id}>
                      <h4>{organisation.name}</h4>
                      <div>
                        <Percent value={commissionRate} /> au lieu de{' '}
                        <Percent value={organisation.commissionRate} />
                      </div>
                      <CollectionIconLink relatedDoc={loan} />
                    </div>
                  );
                }

                if (insuranceRequest) {
                  return (
                    <div className="flex-col" key={_id}>
                      <h4>{organisation.name}</h4>
                      <div>
                        <Percent value={commissionRate} /> au lieu de{' '}
                        <Percent value={organisation.commissionRate} />
                      </div>
                      <CollectionIconLink relatedDoc={insuranceRequest} />
                    </div>
                  );
                }

                return <div key={_id}>Revenu sans dossier?</div>;
              },
            )}
          </div>
        </DialogSimple>
      }
    />
  );
};

export default WrongCommissions;
