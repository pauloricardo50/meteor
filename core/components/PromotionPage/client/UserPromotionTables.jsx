// @flow
import React from 'react';

import ResidenceTypeSetter from 'core/components/ResidenceTypeSetter';
import UserPromotionOptionsTable from './UserPromotionOptionsTable';
import UserPromotionLotsTable from './UserPromotionLotsTable';

type UserPromotionTablesProps = {
  loan: Object,
  promotion: Object,
};

const UserPromotionTables = ({ loan, promotion }: UserPromotionTablesProps) => {
  const { residenceType } = loan;
  return (
    <>
      <ResidenceTypeSetter loan={loan} />
      {residenceType && (
        <>
          <UserPromotionOptionsTable promotion={promotion} loan={loan} />
          <UserPromotionLotsTable promotion={promotion} loan={loan} />
        </>
      )}
    </>
  );
};

export default UserPromotionTables;
