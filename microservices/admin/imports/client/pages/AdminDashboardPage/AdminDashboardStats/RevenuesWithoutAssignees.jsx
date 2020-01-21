// @flow
import React from 'react';

import { adminRevenues } from 'core/api/revenues/queries';
import DialogSimple from 'core/components/DialogSimple';
import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { LOANS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatItem from './StatItem';

type RevenuesWithoutAssigneesProps = {};

const RevenuesWithoutAssignees = (props: RevenuesWithoutAssigneesProps) => {
  const { data: revenues = [], loading } = useStaticMeteorData({
    query: adminRevenues,
    params: {
      $body: { loan: { name: 1 } },
      filters: {
        $or: [
          { assigneeLink: { $exists: false } },
          { 'assigneeLink._id': { $exists: false } },
          { 'assigneeLink._id': { $type: 'null' } },
        ],
      },
    },
  });

  const isOk = revenues.length === 0;

  return (
    <StatItem
      title={<span>Revenus sans conseiller</span>}
      value={!loading && revenues.length}
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher clients concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Clients sans conseiller"
          >
            <div className="flex-col">
              {!loading &&
                revenues.map(
                  ({ loan }) =>
                    loan && (
                      <CollectionIconLink
                        key={loan._id}
                        relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                      />
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
