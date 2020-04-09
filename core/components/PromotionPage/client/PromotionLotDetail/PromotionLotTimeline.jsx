import React from 'react';
import moment from 'moment';

import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../../ConstructionTimeline';
import T, { Money } from '../../../Translation';
import { getItemDate } from '../PromotionTimeline';

const PromotionLotTimeline = ({
  constructionTimeline,
  signingDate,
  promotionLot,
}) => {
  const { properties } = promotionLot;
  const [
    { landValue = 0, constructionValue, additionalMargin = 0 },
  ] = properties;

  const startDate = signingDate ? (
    moment(signingDate).format('MMM YYYY')
  ) : (
    <T id="PromotionTimelineHeader.undetermined" />
  );

  const columns = [
    {
      id: 'root1',
      Header: () => (
        <div className="construction-timeline-header">
          <h4>
            <T id="PromotionLotTimeline.notary" />
          </h4>
          <b>
            <Money value={landValue + additionalMargin} />
          </b>
        </div>
      ),
      columns: [
        {
          id: 'land',
          value: landValue,
          Header: () => (
            <ConstructionTimelineItem
              description={<T id="Forms.landValue" />}
              date={startDate}
              value={landValue}
            />
          ),
        },
        {
          id: 'margin',
          value: additionalMargin,
          Header: () => (
            <ConstructionTimelineItem
              description={<T id="Forms.additionalMargin" />}
              date={startDate}
              value={additionalMargin}
            />
          ),
        },
      ].filter(({ value }) => value),
    },
    {
      id: 'root2',
      Header: () => (
        <div className="construction-timeline-header end">
          <h4>
            <T id="PromotionLotTimeline.construction" />
          </h4>
          <b>
            <Money value={constructionValue} />
          </b>
        </div>
      ),
      columns: constructionTimeline.map(({ description, percent }, index) => {
        const prevDuration = constructionTimeline
          .slice(0, index)
          .reduce((tot, { duration }) => tot + duration, 0);

        return {
          Header: () => (
            <ConstructionTimelineItem
              description={`${index + 1}. ${description}`}
              percent={percent}
              date={getItemDate({ signingDate, prevDuration, index })}
              isLast={index + 1 === constructionTimeline.length}
              value={percent * constructionValue}
            />
          ),
          id: `${index}`,
        };
      }),
    },
  ];

  return (
    <div className="promotion-lot-timeline">
      <ConstructionTimeline columns={columns} />
    </div>
  );
};

export default PromotionLotTimeline;
