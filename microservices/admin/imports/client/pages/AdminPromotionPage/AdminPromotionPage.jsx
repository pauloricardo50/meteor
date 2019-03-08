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
      canModifyPromotion
      canInviteCustomers
      canManageDocuments
      canSeeCustomers
      canAddLots
      canModifyLots
      canRemoveLots
    />
  </>
);

export default AdminPromotionPageContainer(AdminPromotionPage);
