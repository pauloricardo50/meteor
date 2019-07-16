// @flow
import React from 'react';
import cx from 'classnames';

import { Money } from '../Translation/numberComponents/index';
import Percent from '../Translation/numberComponents/Percent';

type PromotionTimeLineSectionProps = {
  title: String,
  icon: React.Node,
  value: Number,
  tranches: Array<Object>,
};

const PromotionTimeLineSection = ({
  title,
  icon,
  value,
  tranches = [],
}: PromotionTimeLineSectionProps) => (
  <div className="promotion-timeline-section">
    {!!title && (
      <div className="promotion-timeline-section-title">
        {icon}
        <h3>
          {title}
          {value && (
            <>
              &nbsp;:&nbsp;
              <Money value={value} />
            </>
          )}
        </h3>
      </div>
    )}
    <div className="promotion-timeline-section-tranches">
      {tranches.map((tranch) => {
        const {
          title: tranchTitle,
          date,
          value: tranchValue,
          percent,
          done = false,
          first = false,
        } = tranch;
        return (
          <div
            className={cx('promotion-timeline-section-tranch', { done, first })}
            key={tranchTitle}
          >
            <b>{tranchTitle}</b>
            <p>{date}</p>
            <h4>
              {tranchValue ? (
                <Money value={tranchValue} />
              ) : (
                <Percent value={percent} />
              )}
            </h4>
          </div>
        );
      })}
    </div>
  </div>
);

export default PromotionTimeLineSection;
