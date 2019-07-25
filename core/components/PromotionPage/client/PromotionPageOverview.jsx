// @flow
import React, { useContext } from 'react';

import PromotionTimeline from '../../PromotionTimeline';
import PromotionLotsTable from './PromotionLotsTable';
import LotsTable from './LotsTable';
import PromotionTimelineForm from './PromotionTimelineForm';
import PromotionPermissionsContext from './PromotionPermissions';

type PromotionPageOverviewProps = {};

const PromotionPageOverview = ({ promotion }: PromotionPageOverviewProps) => {
  const { canChangeTimeline } = useContext(PromotionPermissionsContext);
  return (
    <div className="promotion-page-overview">
      {canChangeTimeline && <PromotionTimelineForm promotion={promotion} />}
      <PromotionTimeline promotion={promotion} />
      <PromotionLotsTable promotion={promotion} />
      <LotsTable promotion={promotion} />
    </div>
  );
};

export default PromotionPageOverview;
