// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AdminPromotionPageContainer from './AdminPromotionPageContainer';

type AdminPromotionPageProps = {};

const AdminPromotionPage = ({
  promotion,
  currentUser,
}: AdminPromotionPageProps) => (
  <PromotionPage promotion={promotion} currentUser={currentUser} />
);

export default AdminPromotionPageContainer(AdminPromotionPage);
