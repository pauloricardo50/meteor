// @flow
import { Meteor } from 'meteor/meteor';

import React, { useContext } from 'react';
import { Element } from 'react-scroll';

import T from '../../Translation';
import ResidenceTypeSetter from '../../ResidenceTypeSetter';
import {
  ProPromotionLotsTable,
  AppPromotionLotsTable,
} from './PromotionLotsTable';
import LotsTable from './LotsTable';
import PromotionTimelineForm from './PromotionTimelineForm';
import PromotionMetadataContext from './PromotionMetadata';
import PromotionTimeline from './PromotionTimeline';
import UserPromotionOptionsTable from './UserPromotionOptionsTable';
import PromotionReservationsTable from './PromotionReservationsTable';
import UserReservation from './UserReservation';

type PromotionPageOverviewProps = {};

const PromotionPageOverview = ({
  promotion,
  loan,
}: PromotionPageOverviewProps) => {
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
        <>
          <ResidenceTypeSetter
            loan={loan}
            text={<T id="PromotionPage.residenceTypeSetter.text" />}
          />
          {loan.promotionReservations
            && loan.promotionReservations.map(promotionReservation => (
              <UserReservation
                promotionReservation={promotionReservation}
                key={promotionReservation._id}
                className="card1 card-top"
                progressVariant="text"
              />
            ))}
          {loan.residenceType
            && loan.promotionOptions
            && loan.promotionOptions.length > 0 && (
            <div className="card1 card-top">
              <UserPromotionOptionsTable promotion={promotion} loan={loan} />
            </div>
          )}
          {loan.residenceType && (
            <AppPromotionLotsTable
              promotion={promotion}
              loan={loan}
              className="card1 card-top"
            />
          )}
        </>
      ) : (
        <>
          <PromotionReservationsTable
            promotionId={promotion._id}
            className="card1 card-top"
          />
          <ProPromotionLotsTable
            promotion={promotion}
            className="card1 card-top"
          />
        </>
      )}

      {promotion.lots
        && promotion.lots.length > 0
        && (!isApp || loan.residenceType) && (
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
