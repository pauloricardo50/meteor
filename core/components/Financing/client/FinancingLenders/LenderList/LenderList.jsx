import React, { useMemo } from 'react';

import { SUCCESS } from '../../../../../api/constants';
import LenderListItem from './LenderListItem';
import { mapOrganisation } from './LenderListItemRules';

const LenderList = ({ organisations, loan, structureId }) => {
  const mappedOrganisations = useMemo(
    () =>
      organisations
        .filter(({ lenderRules }) => lenderRules && lenderRules.length > 0)
        .map(organisation => ({
          _id: organisation._id,
          name: organisation.name,
          ...mapOrganisation({ loan, structureId, organisation }),
        }))
        .sort()
        .sort((a, b) => {
          const successCountA = [
            a.incomeRatioStatus,
            a.borrowRatioStatus,
          ].filter(s => s === SUCCESS).length;
          const successCountB = [
            b.incomeRatioStatus,
            b.borrowRatioStatus,
          ].filter(s => s === SUCCESS).length;

          return successCountB - successCountA;
        }),
    [organisations, loan, structureId],
  );

  return (
    <div className="lender-list">
      {mappedOrganisations.map(org => (
        <LenderListItem key={org._id} {...org} />
      ))}
    </div>
  );
};

export default LenderList;
