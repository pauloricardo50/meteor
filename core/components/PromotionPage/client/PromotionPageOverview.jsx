// @flow
import React, { useContext } from 'react';
import { Element } from 'react-scroll';

import { CurrentUserContext } from 'core/containers/CurrentUserContext';
import T from '../../Translation';
import {
  ProPromotionLotsTable,
  AppPromotionLotsTable,
} from './PromotionLotsTable';
import LotsTable from './LotsTable';
import PromotionTimelineForm from './PromotionTimelineForm';
import PromotionPermissionsContext from './PromotionPermissions';
import PromotionTimeline from './PromotionTimeline';

type PromotionPageOverviewProps = {};

const PromotionPageOverview = ({
  promotion,
  loan,
}: PromotionPageOverviewProps) => {
  const { canChangeTimeline } = useContext(PromotionPermissionsContext);
  const { isUser } = useContext(CurrentUserContext);
  const { constructionTimeline, signingDate } = promotion;

  return (
    <div className="promotion-page-overview animated fadeIn">
      {canChangeTimeline && <PromotionTimelineForm promotion={promotion} />}

      {constructionTimeline && constructionTimeline.length > 0 && (
        <>
          <h3>
            <T id="PromotionPage.timeline" />
          </h3>
          <div className="promotion-timeline">
            <PromotionTimeline
              constructionTimeline={constructionTimeline}
              signingDate={signingDate}
            />
          </div>
        </>
      )}

      {isUser ? (
        <AppPromotionLotsTable
          promotion={promotion}
          loan={loan}
          className="card1"
        />
      ) : (
        <ProPromotionLotsTable promotion={promotion} className="card1" />
      )}

      <Element name="additional-lots-table" className="additional-lots-table">
        <LotsTable promotion={promotion} className="card1" />
      </Element>
    </div>
  );
};

export default PromotionPageOverview;
