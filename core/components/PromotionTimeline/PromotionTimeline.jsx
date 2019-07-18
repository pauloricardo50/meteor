// @flow
import React from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/pro-light-svg-icons/faHandshake';
import { faHomeAlt } from '@fortawesome/pro-light-svg-icons/faHomeAlt';
import PromotionTimeLineSection from './PromotionTimelineSection';

type PromotionTimelineProps = {
  promotion: Object,
  promotionLot: Object,
};

const PromotionTimeline = (props: PromotionTimelineProps) => {
  const {
    promotion: {
      constructionTimeline: promotionConstructionTimeline,
      signingDate: promotionSigningDate,
    } = {},
    promotionLot: {
      promotion: {
        constructionTimeline: promotionLotConstructionTimeline,
        signingDate: promotionLotSigningDate,
      } = {},
      properties = [],
    } = {},
  } = props;

  const constructionTimeline = promotionConstructionTimeline || promotionLotConstructionTimeline;

  if (!constructionTimeline || constructionTimeline.length === 0) {
    return null;
  }

  const signingDate = promotionSigningDate || promotionLotSigningDate;

  const property = properties.length ? properties[0] : {};
  const {
    additionalMargin = 0,
    constructionValue = 0,
    landValue = 0,
  } = property;

  const isPromotionLot = !!props.promotionLot;

  const today = moment(new Date());

  return (
    <div className="promotion-timeline">
      {isPromotionLot && (
        <PromotionTimeLineSection
          title="Notaire"
          value={landValue + additionalMargin}
          icon={<FontAwesomeIcon icon={faHandshake} className="icon" />}
          tranches={[
            landValue && {
              title: 'Achat terrain',
              date: moment(signingDate).format('MMM YYYY'),
              value: landValue,
              done: today >= moment(signingDate),
              first: !!landValue,
            },
            additionalMargin && {
              title: 'Mise en valeur',
              date: moment(signingDate).format('MMM YYYY'),
              value: additionalMargin,
              done: today >= moment(signingDate),
              first: !landValue,
            },
          ].filter(x => x)}
        />
      )}
      <PromotionTimeLineSection
        title={isPromotionLot && 'Construction'}
        value={isPromotionLot && constructionValue}
        icon={
          isPromotionLot && (
            <FontAwesomeIcon icon={faHomeAlt} className="icon" />
          )
        }
        tranches={constructionTimeline.map((tranch, index) => {
          const { description, percent, duration: tranchDuration } = tranch;
          const dateOffset = constructionTimeline
            .slice(0, index)
            .reduce((offset, { duration }) => offset + duration, 0);
          return {
            title: description,
            date: moment(signingDate)
              .add(dateOffset, 'M')
              .format('MMM YYYY'),
            value: isPromotionLot && percent * constructionValue,
            percent: !isPromotionLot && percent,
            done:
              today
              >= moment(signingDate).add(dateOffset + tranchDuration, 'M'),
            first: index === 0 && !isPromotionLot,
          };
        })}
      />
    </div>
  );
};

export default PromotionTimeline;
