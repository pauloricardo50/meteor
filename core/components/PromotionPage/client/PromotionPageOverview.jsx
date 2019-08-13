// @flow
import React, { useContext } from 'react';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import PromotionTimeline from '../../PromotionTimeline';
import {
  ProPromotionLotsTable,
  AppPromotionLotsTable,
} from './PromotionLotsTable';
import LotsTable from './LotsTable';
import PromotionTimelineForm from './PromotionTimelineForm';
import PromotionPermissionsContext from './PromotionPermissions';

type PromotionPageOverviewProps = {};

const PromotionPageOverview = ({
  promotion,
  loan,
}: PromotionPageOverviewProps) => {
  const { canChangeTimeline } = useContext(PromotionPermissionsContext);
  const { isUser } = useContext(CurrentUserContext);
  return (
    <div className="promotion-page-overview">
      {canChangeTimeline && <PromotionTimelineForm promotion={promotion} />}
      <PromotionTimeline promotion={promotion} />
      {isUser ? (
        <AppPromotionLotsTable promotion={promotion} loan={loan} />
      ) : (
        <ProPromotionLotsTable promotion={promotion} />
      )}
      <LotsTable promotion={promotion} />
    </div>
  );
};

export default PromotionPageOverview;
