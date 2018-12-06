// @flow
import React from 'react';
import UserPromotionOptionsTable from 'core/components/PromotionPage/client/UserPromotionOptionsTable';

type SinglePromotionTabProps = {};

const SinglePromotionTab = ({ loan, promotion }: SinglePromotionTabProps) => (
  <UserPromotionOptionsTable loan={loan} promotion={promotion} isAdmin />
);

export default SinglePromotionTab;
