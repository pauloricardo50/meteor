// @flow
import React from 'react';
import moment from 'moment';

import T from '../../Translation';
import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../ConstructionTimeline';

type PromotionTimelineProps = {};

const PromotionTimelineHeader = ({ constructionTimeline, signingDate }) => {
  const monthCount = constructionTimeline.reduce(
    (tot, { duration }) => tot + duration,
    0,
  );
  return (
    <div className="construction-timeline-header">
      <div>
        <T
          id="PromotionTimelineHeader.start"
          values={{ date: <b>{moment(signingDate).format('MMM YYYY')}</b> }}
        />
      </div>
      <div>
        <T
          id="PromotionTimelineHeader.end"
          values={{
            date: (
              <b>
                {moment(signingDate)
                  .add(monthCount, 'months')
                  .format('MMM YYYY')}
              </b>
            ),
          }}
        />
      </div>
    </div>
  );
};


const PromotionTimeline = ({
  constructionTimeline,
  signingDate,
}: PromotionTimelineProps) => {
  const columns = [
    {
      Header: () => (
        <PromotionTimelineHeader
          constructionTimeline={constructionTimeline}
          signingDate={signingDate}
        />
      ),
      id: 'root',
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
            />
          ),
          id: `${index}`,
        };
      }),
    },
  ];

  return <ConstructionTimeline columns={columns} />;
};

export default PromotionTimeline;
