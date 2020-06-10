import React from 'react';
import moment from 'moment';

import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../ConstructionTimeline';
import T, { IntlDate } from '../../Translation';

const getMonthDelta = count => `+${count} mois`;

const PromotionTimelineHeader = ({ constructionTimeline, signingDate }) => {
  const { steps } = constructionTimeline;
  const constructionStartDate = steps[0].startDate;

  const showExactDates = !!signingDate;

  return (
    <div className="construction-timeline-header">
      <div className="flex center-align">
        <div className="mr-8">
          <b>
            <T id="Forms.signingDate" />
            :&nbsp;
          </b>
          <span>
            {showExactDates ? (
              <IntlDate value={signingDate} />
            ) : (
              <T id="PromotionTimelineHeader.undetermined" />
            )}
          </span>
        </div>
        <div>
          <b>
            <T id="PromotionTimelineHeader.constructionStart" />
            :&nbsp;
          </b>
          <span>
            {showExactDates ? (
              <IntlDate value={constructionStartDate} />
            ) : (
              <T id="PromotionTimelineHeader.undetermined" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export const getTimelineDateText = ({ signingDate, firstDate, date }) => {
  if (signingDate) {
    return <IntlDate value={date} />;
  }

  if (!date) {
    return <T id="PromotionTimeline.start" />;
  }

  const monthsDiff = moment(date).diff(firstDate, 'months');

  return getMonthDelta(monthsDiff);
};

const PromotionTimeline = ({ constructionTimeline, signingDate }) => {
  const { endDate, endPercent } = constructionTimeline;

  const columns = [
    {
      Header: () => (
        <PromotionTimelineHeader
          constructionTimeline={constructionTimeline}
          signingDate={signingDate}
        />
      ),
      id: 'root',
      columns: [
        ...constructionTimeline.steps.map(
          ({ description, percent, startDate }, index) => ({
            Header: () => (
              <ConstructionTimelineItem
                description={`${index + 1}. ${description}`}
                percent={percent}
                date={getTimelineDateText({
                  signingDate,
                  date: index > 0 && startDate,
                  firstDate: constructionTimeline.steps[0].startDate,
                })}
              />
            ),
            id: `${index}`,
          }),
        ),
        {
          Header: () => (
            <ConstructionTimelineItem
              description={<T id="PromotionTimelineHeader.constructionEnd" />}
              percent={endPercent}
              date={getTimelineDateText({
                signingDate,
                date: endDate,
                firstDate: constructionTimeline.steps[0].startDate,
              })}
              isLast
            />
          ),
          id: 'end',
        },
      ],
    },
  ];

  return <ConstructionTimeline columns={columns} />;
};

export default PromotionTimeline;
