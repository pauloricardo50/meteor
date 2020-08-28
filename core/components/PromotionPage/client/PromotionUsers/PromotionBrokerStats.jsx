import React from 'react';
import { faHandshake } from '@fortawesome/pro-light-svg-icons/faHandshake';
import { faMoneyCheckEditAlt } from '@fortawesome/pro-light-svg-icons/faMoneyCheckEditAlt';
import { faUserPlus } from '@fortawesome/pro-light-svg-icons/faUserPlus';
import cx from 'classnames';

import { PROMOTION_OPTION_STATUS } from '../../../../api/promotionOptions/promotionOptionConstants';
import { FaIcon } from '../../../Icon';
import T from '../../../Translation';

const getBrokerStats = ({ promotionOptions = [], userId, loading }) => {
  if (loading) {
    return {};
  }

  let loanIds = [];

  return promotionOptions
    .filter(promotionOption => userId === promotionOption?.invitedBy)
    .reduce((stats, promotionOption) => {
      const loanId = promotionOption?.loanCache?.[0]?._id;
      const status = promotionOption?.status;

      const { loanCount = 0, reservedCount = 0, soldCount = 0 } = stats;
      const isLoanAlreadyCounted = loanIds.includes(loanId);
      loanIds = [...loanIds, loanId];

      const isReserved = status === PROMOTION_OPTION_STATUS.RESERVED;
      const isSold = status === PROMOTION_OPTION_STATUS.SOLD;

      return {
        loanCount: isLoanAlreadyCounted ? loanCount : loanCount + 1,
        reservedCount: isReserved || isSold ? reservedCount + 1 : reservedCount,
        soldCount: isSold ? soldCount + 1 : soldCount,
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
      <b
        className={cx('ml-4', { 'mr-4': !isLastElement })}
        style={{ minWidth: '2em' }}
      >
        {count}
      </b>
    </>
  );
};

const PromotionBrokerStats = ({ promotionOptions, userId, loading }) => {
  const stats = getBrokerStats({
    promotionOptions,
    userId,
    loading,
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
