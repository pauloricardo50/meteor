// @flow
import React from 'react';

import PromotionLotPage from 'core/components/PromotionLotPage';
import AdminPromotionLotPageContainer from './AdminPromotionLotPageContainer';

type AdminPromotionLotPageProps = {};

const AdminPromotionLotPage = (props: AdminPromotionLotPageProps) => (
  <PromotionLotPage {...props} canModify />
);

export default AdminPromotionLotPageContainer(AdminPromotionLotPage);
