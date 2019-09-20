// @flow
import React from 'react';
import moment from 'moment';

import T, { Money } from '../../../Translation';
import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../../ConstructionTimeline';

type PromotionLotTimelineProps = {};

const PromotionLotTimeline = ({
  constructionTimeline,
  signingDate,
  promotionLot,
}: PromotionLotTimelineProps) => {
  const { properties } = promotionLot;
  const [
    { landValue = 0, constructionValue, additionalMargin = 0 },
  ] = properties;
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
              date={moment(signingDate).format('MMM YYYY')}
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
              date={moment(signingDate).format('MMM YYYY')}
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
              date={moment(signingDate)
                .add(prevDuration, 'months')
                .format('MMM YYYY')}
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
