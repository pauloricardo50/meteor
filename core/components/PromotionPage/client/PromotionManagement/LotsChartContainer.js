import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';

import { PROMOTION_LOT_STATUS } from 'core/api/constants';
import { toMoney } from 'core/utils/conversionFunctions';

const getFilteredLots = (promotionLots = []) => {
  const availableLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.AVAILABLE);
  const bookedLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.BOOKED);
  const soldLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.SOLD);

  return { availableLots, bookedLots, soldLots };
};

const getData = (promotionLots = []) => {
  const { availableLots, bookedLots, soldLots } = getFilteredLots(promotionLots);
  return [
    {
      name: PROMOTION_LOT_STATUS.SOLD,
      y: soldLots.length,
    },
    {
      name: PROMOTION_LOT_STATUS.BOOKED,
      y: bookedLots.length,
    },
    {
      name: PROMOTION_LOT_STATUS.AVAILABLE,
      y: availableLots.length,
    },
  ].filter(({ y }) => y > 0);
};

const getTotalValueByStatus = (promotionLots = [], status) => {
  const { availableLots, bookedLots, soldLots } = getFilteredLots(promotionLots);
  let totalValue = 0;

  switch (status) {
  case PROMOTION_LOT_STATUS.BOOKED:
    totalValue = bookedLots.reduce((total, { value }) => total + value, 0);
    break;
  case PROMOTION_LOT_STATUS.SOLD:
    totalValue = soldLots.reduce((total, { value }) => total + value, 0);
    break;
  case PROMOTION_LOT_STATUS.AVAILABLE:
    totalValue = availableLots.reduce((total, { value }) => total + value, 0);
    break;

  default:
    break;
  }

  return totalValue;
};

const getConfig = (promotionLots = [], formatMessage) => ({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  credits: { enabled: false },
  title: {
    text: 'Lots',
  },
  tooltip: {
    formatter() {
      const { y, key } = this;
      const totalValue = getTotalValueByStatus(promotionLots, key);
      const title = formatMessage({ id: `Forms.status.${key}` });

      return `<b>${title}</b><br/><b>${y}</b> lots<br/><b>CHF ${toMoney(totalValue)}</b>`;
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
