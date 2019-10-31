import { PROMOTION_LOT_STATUS } from 'core/api/constants';

const getPromotionLotsValue = (promotionLots = [], key) =>
  promotionLots.reduce((total, promotionLot) => {
    const { properties = [] } = promotionLot;
    const value = properties.length ? properties[0][key] || 0 : 0;
    return value + total;
  }, 0);

export const getTotalLandValue = (promotionLots = []) =>
  getPromotionLotsValue(promotionLots, 'landValue');
export const getTotalConstructionValue = (promotionLots = []) =>
  getPromotionLotsValue(promotionLots, 'constructionValue');
export const getTotalAdditionalMargin = (promotionLots = []) =>
  getPromotionLotsValue(promotionLots, 'additionalMargin');
export const getTotalUndetailedValue = (promotionLots = []) =>
  getPromotionLotsValue(promotionLots, 'value');

export const getTotalAdditionalLotsValue = (promotionLots = []) =>
  promotionLots.reduce((totalValue, promotionLot) => {
    const { lots = [] } = promotionLot;
    return totalValue + lots.reduce((total, { value }) => total + value, 0);
  }, 0);

export const getTotalValue = (promotionLots = []) =>
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

export const getGroupedLots = (promotionLots = []) => {
  const availableLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.AVAILABLE);
  const reservedLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.RESERVED);
  const soldLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.SOLD);

  return { availableLots, reservedLots, soldLots };
};

export const getTotalValueByStatus = (promotionLots = [], status) => {
  const { availableLots, reservedLots, soldLots } = getGroupedLots(promotionLots);
  let totalValue = 0;

  switch (status) {
  case PROMOTION_LOT_STATUS.RESERVED:
    totalValue = reservedLots.reduce((total, { value }) => total + value, 0);
    break;
  case PROMOTION_LOT_STATUS.SOLD:
    totalValue = soldLots.reduce((total, { value }) => total + value, 0);
    break;
  case PROMOTION_LOT_STATUS.AVAILABLE:
    totalValue = availableLots.reduce((total, { value }) => total + value, 0);
    break;
  case 'ALL':
    totalValue = [...reservedLots, ...soldLots, ...availableLots].reduce(
      (total, { value }) => total + value,
      0,
    );
    break;

  default:
    break;
  }

  return totalValue;
};
