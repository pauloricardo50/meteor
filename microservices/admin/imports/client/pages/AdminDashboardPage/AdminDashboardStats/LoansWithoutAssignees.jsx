import React from 'react';
import CountUp from 'react-countup';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import DialogSimple from 'core/components/DialogSimple';
import { LOANS_COLLECTION } from 'core/api/constants';
import { CollectionIconLink } from 'core/components/IconLink';
import StatItem from './StatItem';

const LoansWithoutAssignees = ({ showAll }) => {
  const { data: loans = [] } = useStaticMeteorData({
    query: LOANS_COLLECTION,
    params: {
      $filters: {
        anonymous: { $ne: true },
        $or: [
          { assigneeLinks: { $exists: false } },
          { assigneeLinks: { $size: 0 } },
        ],
      },
      name: 1,
      borrowers: { name: 1 },
      user: { name: 1 },
    },
  });

  const isOk = loans.length === 0;

  if (!showAll && isOk) {
    return null;
  }

  return (
    <StatItem
      value={<CountUp end={loans.length} preserveValue separator=" " />}
      positive={loans.length === 0}
      title="Dossiers sans conseiller"
      top={
        isOk ? (
          <p>Tout est bon!</p>
        ) : (
          <DialogSimple
            buttonProps={{
              label: 'Afficher dossiers concernés',
              raised: false,
              primary: true,
            }}
            closeOnly
            maxWidth="lg"
            title="Dossiers sans conseiller"
          >
            <>
              <p className="description">
                Il manque un conseiller sur ce dossier!
              </p>

              <div>
                {loans.map(loan => (
                  <CollectionIconLink
                    key={loan._id}
                    relatedDoc={{ ...loan, collection: LOANS_COLLECTION }}
                  />
                ))}
              </div>
            </>
          </DialogSimple>
        )
      }
    />
  );
};

export default LoansWithoutAssignees;
