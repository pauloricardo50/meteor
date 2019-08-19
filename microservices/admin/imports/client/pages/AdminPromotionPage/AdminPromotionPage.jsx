// @flow
import React from 'react';

import PromotionPage from 'core/components/PromotionPage/client';
import AdminPromotionPageContainer from './AdminPromotionPageContainer';

type AdminPromotionPageProps = {};

const AdminPromotionPage = (props: AdminPromotionPageProps) => (
  <PromotionPage {...props} />
);

export default AdminPromotionPageContainer(AdminPromotionPage);
