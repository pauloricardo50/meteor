// @flow
import React from 'react';

import UserPromotionOptionsTable from './UserPromotionOptionsTable';
import UserPromotionLotsTable from './UserPromotionLotsTable';
import ResidenceTypeSetter from 'core/components/ResidenceTypeSetter/ResidenceTypeSetter';

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
