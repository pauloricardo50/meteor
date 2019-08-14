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
  const { canChangeTimeline, canModifyLots } = useContext(PromotionPermissionsContext);
  const { isUser } = useContext(CurrentUserContext);
  return (
    <div className="promotion-page-overview">
      {canChangeTimeline && <PromotionTimelineForm promotion={promotion} />}
      <PromotionTimeline promotion={promotion} />
      {isUser ? (
        <AppPromotionLotsTable
          promotion={promotion}
          loan={loan}
          className="card1"
        />
      ) : (
        <ProPromotionLotsTable promotion={promotion} className="card1" />
      )}
      <LotsTable promotion={promotion} canModifyLots={canModifyLots} className="card1" />
    </div>
  );
};

export default PromotionPageOverview;
