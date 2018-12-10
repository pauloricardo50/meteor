// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AdminPromotionPageContainer from './AdminPromotionPageContainer';
import PromotionUsersTable from './PromotionUsersTable';

type AdminPromotionPageProps = {};

const AdminPromotionPage = ({
  promotion,
  currentUser,
}: AdminPromotionPageProps) => (
    <>
      <PromotionUsersTable promotion={promotion} />
      <PromotionPage
        promotion={promotion}
        currentUser={currentUser}
        canModify
        isAdmin
        isPro
      />
    </>
);

export default AdminPromotionPageContainer(AdminPromotionPage);
