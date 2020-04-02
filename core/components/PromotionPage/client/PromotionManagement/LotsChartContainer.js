import { injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';

import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import { toMoney } from '../../../../utils/conversionFunctions';
import { getGroupedLots, getTotalValueByStatus } from './helpers';

const getData = (promotionLots = []) => {
  const { availableLots, reservedLots, soldLots } = getGroupedLots(
    promotionLots,
  );
  return [
    {
      name: PROMOTION_LOT_STATUS.SOLD,
      y: soldLots.length,
    },
    {
      name: PROMOTION_LOT_STATUS.RESERVED,
      y: reservedLots.length,
    },
    {
      name: PROMOTION_LOT_STATUS.AVAILABLE,
      y: availableLots.length,
    },
  ].filter(({ y }) => y > 0);
};

const getSubtitle = (promotionLots = [], formatMessage) => {
  const { availableLots, reservedLots, soldLots } = getGroupedLots(
    promotionLots,
  );
  const totalValue = getTotalValueByStatus(promotionLots, 'ALL');
  const availableLotsLabel = formatMessage({
    id: `Forms.status.${PROMOTION_LOT_STATUS.AVAILABLE}`,
  });
  const reservedLotsLabel = formatMessage({
    id: `Forms.status.${PROMOTION_LOT_STATUS.RESERVED}`,
  });
  const soldLotsLabel = formatMessage({
    id: `Forms.status.${PROMOTION_LOT_STATUS.SOLD}`,
  });

  return `<p>${availableLotsLabel}: ${
    availableLots.length
  } - ${reservedLotsLabel}: ${reservedLots.length} - ${soldLotsLabel}: ${
    soldLots.length
  }<br/>CHF ${toMoney(totalValue)}</p>`;
};

const getConfig = (promotionLots = [], formatMessage) => ({
  chart: {
    type: 'pie',
  },
  title: {
    text: 'Lots',
  },
  subtitle: {
    text: getSubtitle(promotionLots, formatMessage),
  },
  tooltip: {
    formatter() {
      const { y, key } = this;
      const totalValue = getTotalValueByStatus(promotionLots, key);
      const title = formatMessage({ id: `Forms.status.${key}` });

      return `<b>${title}</b><br/><b>${y}</b> lots<br/><b>CHF ${toMoney(
        totalValue,
      )}</b>`;
    },
  },
  plotOptions: {
    pie: {
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        formatter() {
          const { key } = this;
          const title = formatMessage({ id: `Forms.status.${key}` });

          return `<b>${title}</b>`;
        },
      },
    },
  },
  series: [
    {
      name: 'Lots',
      data: getData(promotionLots),
    },
  ],
});

export default compose(
  injectIntl,
  withProps(({ promotionLots = [], intl: { formatMessage } }) => ({
    config: getConfig(promotionLots, formatMessage),
    data: getData(promotionLots),
  })),
);
