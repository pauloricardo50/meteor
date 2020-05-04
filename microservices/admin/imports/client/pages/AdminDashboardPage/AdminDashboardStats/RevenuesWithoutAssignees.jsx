import React from 'react';

import { REVENUES_COLLECTION } from 'core/api/revenues/revenueConstants';
import DialogSimple from 'core/components/DialogSimple';
import { CollectionIconLink } from 'core/components/IconLink';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';

import StatItem from './StatItem';

const RevenuesWithoutAssignees = ({ showAll }) => {
  const { data: revenues = [], loading } = useStaticMeteorData({
    query: REVENUES_COLLECTION,
    params: {
      $filters: {
        $or: [
          { assigneeLink: { $exists: false } },
          { 'assigneeLink._id': { $exists: false } },
          { 'assigneeLink._id': { $type: 'null' } },
        ],
      },
      loan: { name: 1 },
    },
    refetchOnMethodCall: false,
  });

  const isOk = revenues.length === 0;

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      title="Revenus sans conseiller"
      value={!loading && revenues.length}
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher revenus concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Revenus sans conseiller"
          >
            <div className="flex-col">
              {!loading &&
                revenues.map(
                  ({ loan }) =>
                    loan && (
                      <CollectionIconLink key={loan._id} relatedDoc={loan} />
                    ),
                )}
            </div>
          </DialogSimple>
        )
      }
    />
  );
};

export default RevenuesWithoutAssignees;
