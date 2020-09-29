import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Element } from 'react-scroll';

import T from '../../../Translation';
import LotsTable from '../LotsTable';
import { ProPromotionLotsTable } from '../PromotionLotsTable';
import PromotionOptionsTable from '../PromotionOptionsTable';
import { usePromotion } from '../PromotionPageContext';
import PromotionTimeline from '../PromotionTimeline';
import PromotionTimelineForm from '../PromotionTimelineForm';
import AppPromotionPageOverview from './AppPromotionPageOverview';

const PromotionPageOverview = ({ promotion, loan }) => {
  const {
    permissions: { canChangeTimeline },
  } = usePromotion();
  const isApp = Meteor.microservice === 'app';
  const { constructionTimeline, signingDate } = promotion;

  return (
    <div className="promotion-page-overview animated fadeIn">
      {canChangeTimeline && <PromotionTimelineForm promotion={promotion} />}

      {constructionTimeline?.steps?.length > 0 && (
        <>
          <h3>
            <T defaultMessage="Avancement des travaux" />
          </h3>
          <div className="promotion-timeline">
            <PromotionTimeline
              constructionTimeline={constructionTimeline}
              signingDate={signingDate}
            />
          </div>
        </>
      )}

      {isApp ? (
        <AppPromotionPageOverview loan={loan} promotion={promotion} />
      ) : (
        <>
          <PromotionOptionsTable promotion={promotion} />
          <ProPromotionLotsTable
            promotion={promotion}
            className="card1 card-top"
          />
        </>
      )}

      {(!isApp || !loan || loan.residenceType) && (
        <Element name="additional-lots-table" className="additional-lots-table">
          <LotsTable promotion={promotion} className="card1" />
        </Element>
      )}
    </div>
  );
};

export default PromotionPageOverview;
