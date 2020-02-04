//      
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';
import { Element } from 'react-scroll';

import T from '../../../Translation';
import { ProPromotionLotsTable } from '../PromotionLotsTable';
import LotsTable from '../LotsTable';
import PromotionTimelineForm from '../PromotionTimelineForm';
import PromotionMetadataContext from '../PromotionMetadata';
import PromotionTimeline from '../PromotionTimeline';
import PromotionOptionsTable from '../PromotionOptionsTable';
import AppPromotionPageOverview from './AppPromotionPageOverview';

                                     

const PromotionPageOverview = ({
  promotion,
  loan,
}                            ) => {
  const {
    permissions: { canChangeTimeline },
  } = useContext(PromotionMetadataContext);
  const isApp = Meteor.microservice === 'app';
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

      {promotion.lots &&
        promotion.lots.length > 0 &&
        (!isApp || loan.residenceType) && (
          <Element
            name="additional-lots-table"
            className="additional-lots-table"
          >
            <LotsTable promotion={promotion} className="card1" />
          </Element>
        )}
    </div>
  );
};

export default PromotionPageOverview;
