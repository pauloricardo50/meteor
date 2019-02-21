// @flow
import React from 'react';

import PromotionResidenceType from './PromotionResidenceType';
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
      <PromotionResidenceType loan={loan} />
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
