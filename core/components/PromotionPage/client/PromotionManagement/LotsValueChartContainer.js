import { withProps, compose } from 'recompose';
import { injectIntl } from 'react-intl';

import { toMoney } from 'core/utils/conversionFunctions';

const shouldShowDetailedValues = (promotionLots = []) =>
  !promotionLots.some(({ properties = [] }) => properties.length && !!properties[0].value);

const getTotalLandValue = (promotionLots = []) =>
  promotionLots.reduce((totalLandValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const landValue = properties.length ? properties[0].landValue || 0 : 0;
    return landValue + totalLandValue;
  }, 0);

const getTotalConstructionValue = (promotionLots = []) =>
  promotionLots.reduce((totalConstructionValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const constructionValue = properties.length
      ? properties[0].constructionValue || 0
      : 0;
    return constructionValue + totalConstructionValue;
  }, 0);

const getTotalAdditionalMargin = (promotionLots = []) =>
  promotionLots.reduce((totalAdditionalMargin, promotionLot) => {
    const { properties = [] } = promotionLot;
    const additionalMargin = properties.length
      ? properties[0].additionalMargin || 0
      : 0;
    return additionalMargin + totalAdditionalMargin;
  }, 0);

const getTotalUndetailedValue = (promotionLots = []) =>
  promotionLots.reduce((totalValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const property = properties.length && properties[0];

    if (!property) {
      return totalValue;
    }

    const propertyValue = property.value || 0;

    return propertyValue + totalValue;
  }, 0);

const getTotalAdditionalLotsValue = (promotionLots = []) =>
  promotionLots.reduce((totalValue, promotionLot) => {
    const { lots = [] } = promotionLot;
    return totalValue + lots.reduce((total, { value }) => total + value, 0);
  }, 0);

const getTotalValue = (promotionLots = []) =>
  promotionLots.reduce((totalValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const property = properties.length && properties[0];

    if (!property) {
      return totalValue;
    }

    const propertyValue = property.value || 0;

    if (propertyValue) {
      return propertyValue + totalValue;
    }

    const propertyLandValue = property.landValue || 0;
    const propertyConstrunctionValue = property.constructionValue || 0;
    const propertyAdditionalMargin = property.additionalMargin || 0;

    return (
      totalValue
      + propertyLandValue
      + propertyConstrunctionValue
      + propertyAdditionalMargin
    );
  }, getTotalAdditionalLotsValue(promotionLots));

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

const getSubtitle = (promotionLots = []) => {
  const totalValue = getTotalValue(promotionLots);

  return `CHF ${toMoney(totalValue)}`;
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
