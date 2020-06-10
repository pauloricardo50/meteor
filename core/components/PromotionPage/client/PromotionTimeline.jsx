import React from 'react';
import moment from 'moment';

import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../ConstructionTimeline';
import T, { IntlDate } from '../../Translation';

const getMonthDelta = count => `+${count} mois`;

const PromotionTimelineHeader = ({ constructionTimeline, signingDate }) => {
  const { endDate, steps } = constructionTimeline;
  const constructionStartDate = steps[0].startDate;

  const showExactDates = !!signingDate;

  const monthCount = moment(endDate).diff(constructionStartDate, 'months');
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
      <div>
        <div>
          <b>
            <T id="PromotionTimelineHeader.constructionEnd" />
            :&nbsp;
          </b>
          <span>
            {showExactDates ? (
              <IntlDate value={endDate} />
            ) : (
              <T
                id="PromotionTimelineHeader.xMonthsLater"
                values={{ monthCount }}
              />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

const getTimelineDateText = (constructionTimeline, signingDate, index) => {
  const { steps } = constructionTimeline;
  if (signingDate) {
    return <IntlDate value={steps[index].startDate} />;
  }

  if (index === 0) {
    return <T id="PromotionTimeline.start" />;
  }

  const date = steps[index].startDate;
  const initialDate = steps[0].startDate;
  const monthsDiff = moment(date).diff(initialDate, 'months');

  return getMonthDelta(monthsDiff);
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
      columns: constructionTimeline.steps.map(
        ({ description, percent }, index) => ({
          Header: () => (
            <ConstructionTimelineItem
              description={`${index + 1}. ${description}`}
              percent={percent}
              date={getTimelineDateText(
                constructionTimeline,
                signingDate,
                index,
              )}
              isLast={index + 1 === constructionTimeline.steps.length}
            />
          ),
          id: `${index}`,
        }),
      ),
    },
  ];

  return <ConstructionTimeline columns={columns} />;
};

export default PromotionTimeline;
