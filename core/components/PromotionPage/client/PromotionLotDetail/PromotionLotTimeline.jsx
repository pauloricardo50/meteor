import React from 'react';

import { propertyHasDetailedValue } from '../../../../api/properties/propertyClientHelper';
import ConstructionTimeline, {
  ConstructionTimelineItem,
} from '../../../ConstructionTimeline';
import T, { IntlDate, Money } from '../../../Translation';
import { getTimelineDateText } from '../PromotionTimeline';

const PromotionLotTimeline = ({
  constructionTimeline,
  signingDate,
  promotionLot,
}) => {
  const { properties } = promotionLot;
  const [property] = properties;
  const { landValue = 0, additionalMargin = 0, constructionValue } = property;
  const { startPercent, endDate, endPercent } = constructionTimeline;
  const showExactDates = !!signingDate;

  const hasDetailedValue = propertyHasDetailedValue({ property });

  const initialPaymentDate = showExactDates ? (
    <IntlDate value={signingDate} year="numeric" month="long" day="numeric" />
  ) : (
    <T defaultMessage="À déterminer" />
  );
  const initialConstructionPayment = startPercent * constructionValue;
  const totalInitialPayment =
    landValue + additionalMargin + initialConstructionPayment;

  const columns = [
    {
      id: 'root1',
      Header: () => (
        <div className="construction-timeline-header">
          <h4>
            <T defaultMessage="Chez le notaire" />
          </h4>
          <b>
            <Money value={totalInitialPayment} />
          </b>
        </div>
      ),
      columns: [
        {
          id: 'landAndMargin',
          value: landValue + additionalMargin,
          Header: () => (
            <ConstructionTimelineItem
              description={<T id="Forms.promotionShare" />}
              date={initialPaymentDate}
              value={landValue + additionalMargin}
            />
          ),
        },
        {
          id: 'initialConstructionPayment',
          value: initialConstructionPayment,
          Header: () => (
            <ConstructionTimelineItem
              description={
                <T id="PromotionLotTimeline.initialConstructionPayment" />
              }
              date={initialPaymentDate}
              value={initialConstructionPayment}
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
            <T defaultMessage="Durant la construction" />
          </h4>
          {hasDetailedValue && (
            <b>
              <Money value={constructionValue - initialConstructionPayment} />
            </b>
          )}
        </div>
      ),
      columns: [
        ...constructionTimeline.steps.map(
          ({ description, percent, startDate }, index) => ({
            Header: () => (
              <ConstructionTimelineItem
                description={`${index + 1}. ${description}`}
                percent={percent}
                date={getTimelineDateText({
                  signingDate,
                  date: startDate,
                  firstDate: constructionTimeline.steps[0].startDate,
                  index,
                })}
                value={hasDetailedValue && percent * constructionValue}
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
              value={hasDetailedValue && endPercent * constructionValue}
            />
          ),
          id: 'end',
        },
      ],
    },
  ];

  return (
    <div className="promotion-lot-timeline">
      <ConstructionTimeline columns={columns} />
    </div>
  );
};

export default PromotionLotTimeline;
