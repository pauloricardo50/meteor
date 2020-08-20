import React from 'react';
import { faHandshake } from '@fortawesome/pro-light-svg-icons/faHandshake';
import { faMoneyCheckEditAlt } from '@fortawesome/pro-light-svg-icons/faMoneyCheckEditAlt';
import { faUserPlus } from '@fortawesome/pro-light-svg-icons/faUserPlus';
import cx from 'classnames';

import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import { FaIcon } from '../../../Icon';
import T from '../../../Translation';

const getBrokerStats = ({ promotionOptions = [], userId }) => {
  let loanIds = [];

  return promotionOptions
    .filter(promotionOption => {
      const invitedBy =
        promotionOption?.loan?.promotions?.[0]?.$metadata?.invitedBy;

      return userId === invitedBy;
    })
    .reduce((stats, promotionOption) => {
      const loanId = promotionOption?.loan?._id;
      const status = promotionOption?.status;

      const { loanCount = 0, reservedCount = 0 } = stats;
      const isLoanAlreadyCounted = loanIds.includes(loanId);
      loanIds = [...loanIds, loanId];

      return {
        loanCount: !isLoanAlreadyCounted ? loanCount + 1 : loanCount,
        reservedCount: [
          PROMOTION_OPTION_STATUS.RESERVED,
          PROMOTION_OPTION_STATUS.SOLD,
        ].includes(status)
          ? reservedCount + 1
          : reservedCount,
        soldCount:
          status === PROMOTION_OPTION_STATUS.SOLD
            ? reservedCount + 1
            : reservedCount,
      };
    }, {});
};

const icons = {
  loanCount: faUserPlus,
  reservedCount: faMoneyCheckEditAlt,
  soldCount: faHandshake,
};

const Stat = ({ stats, id, isLastElement }) => {
  const count = stats[id] || 0;
  return (
    <>
      <FaIcon
        icon={icons[id]}
        tooltip={
          <T
            id={`PromotionPage.PromotionUsers.stats.${id}`}
            values={{ count }}
          />
        }
        size="lg"
      />
      <span
        className={cx('ml-4', { 'mr-4': !isLastElement })}
        style={{ minWidth: '2em' }}
      >
        {count}
      </span>
    </>
  );
};

const PromotionBrokerStats = ({ promotionOptions, userId }) => {
  const stats = getBrokerStats({
    promotionOptions,
    userId,
  });

  return (
    <div className="flex center-align">
      {['loanCount', 'reservedCount', 'soldCount'].map((id, i, array) => (
        <Stat
          stats={stats}
          id={id}
          key={id}
          isLastElement={i === array.length - 1}
        />
      ))}
    </div>
  );
};

export default PromotionBrokerStats;
