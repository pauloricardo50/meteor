// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AdminPromotionPageContainer from './AdminPromotionPageContainer';

type AdminPromotionPageProps = {};

const AdminPromotionPage = ({
  promotion,
  currentUser,
}: AdminPromotionPageProps) => {
  console.log('promotion', promotion);

  return (
    <PromotionPage
      promotion={promotion}
      currentUser={currentUser}
      canModify
      isAdmin
    />
  );
};

export default AdminPromotionPageContainer(AdminPromotionPage);
