import React from 'react';
import moment from 'moment';

import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../ConstructionTimeline';
import T from '../../Translation';

const getMonthDelta = count => `+${count} mois`;

export const getItemDate = ({ signingDate, prevDuration, index }) => {
  if (signingDate) {
    return moment(signingDate)
      .add(prevDuration, 'months')
      .format('MMM YYYY');
  }

  if (index === 0) {
    return <T id="PromotionTimelineHeader.undetermined" />;
  }

  return getMonthDelta(prevDuration);
};

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
          values={{
            date: (
              <b>
                {signingDate ? (
                  moment(signingDate).format('MMM YYYY')
                ) : (
                  <T id="PromotionTimelineHeader.undetermined" />
                )}
              </b>
            ),
          }}
        />
      </div>
      <div>
        <T
          id="PromotionTimelineHeader.end"
          values={{
            date: (
              <b>
                {signingDate
                  ? moment(signingDate)
                      .add(monthCount, 'months')
                      .format('MMM YYYY')
                  : getMonthDelta(monthCount)}
              </b>
            ),
          }}
        />
      </div>
    </div>
  );
};

const PromotionTimeline = ({ constructionTimeline, signingDate }) => {
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
              date={getItemDate({ signingDate, index, prevDuration })}
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
