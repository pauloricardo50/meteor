import { injectIntl } from 'react-intl';
import { compose, withProps } from 'recompose';

import { toMoney } from '../../../../utils/conversionFunctions';
import {
  getTotalAdditionalLotsValue,
  getTotalAdditionalMargin,
  getTotalConstructionValue,
  getTotalLandValue,
  getTotalUndetailedValue,
  getTotalValue,
} from './helpers';

const getData = (promotionLots = []) => {
  const totalLandValue = getTotalLandValue(promotionLots);
  const totalConstructionValue = getTotalConstructionValue(promotionLots);
  const totalAdditionalMargin = getTotalAdditionalMargin(promotionLots);
  const totalUndetailedValue = getTotalUndetailedValue(promotionLots);
  const totalAdditionalLotsValue = getTotalAdditionalLotsValue(promotionLots);

  return [
    {
      name: 'landValue',
      y: totalLandValue,
    },
    {
      name: 'constructionValue',
      y: totalConstructionValue,
    },
    {
      name: 'additionalMargin',
      y: totalAdditionalMargin,
    },
    {
      name: 'undetailedValue',
      y: totalUndetailedValue,
    },
    {
      name: 'additionalLots',
      y: totalAdditionalLotsValue,
    },
  ].filter(({ y }) => y);
};

const getSubtitle = (promotionLots = []) =>
  `CHF ${toMoney(getTotalValue(promotionLots))}`;

const getConfig = (promotionLots = [], formatMessage) => ({
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    type: 'pie',
  },
  title: {
    text: 'Valeur de la promotion',
  },
  subtitle: {
    text: getSubtitle(promotionLots),
  },
  tooltip: {
    formatter() {
      const { y, key } = this;
      const title = formatMessage({ id: `Forms.${key}` });

      return `<b>${title}</b><br/><b>CHF ${toMoney(y)}</b>`;
    },
  },
  plotOptions: {
    pie: {
      cursor: 'pointer',
      dataLabels: {
        enabled: true,
        formatter() {
          const { key } = this;
          const title = formatMessage({ id: `Forms.${key}` });

          return `<b>${title}</b>`;
        },
      },
    },
  },
  series: [
    {
      name: 'Valeur de la promotion',
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
