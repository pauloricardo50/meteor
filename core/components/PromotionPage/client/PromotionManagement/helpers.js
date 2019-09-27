import { PROMOTION_LOT_STATUS } from 'core/api/constants';

export const getTotalLandValue = (promotionLots = []) =>
  promotionLots.reduce((totalLandValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const landValue = properties.length ? properties[0].landValue || 0 : 0;
    return landValue + totalLandValue;
  }, 0);

export const getTotalConstructionValue = (promotionLots = []) =>
  promotionLots.reduce((totalConstructionValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const constructionValue = properties.length
      ? properties[0].constructionValue || 0
      : 0;
    return constructionValue + totalConstructionValue;
  }, 0);

export const getTotalAdditionalMargin = (promotionLots = []) =>
  promotionLots.reduce((totalAdditionalMargin, promotionLot) => {
    const { properties = [] } = promotionLot;
    const additionalMargin = properties.length
      ? properties[0].additionalMargin || 0
      : 0;
    return additionalMargin + totalAdditionalMargin;
  }, 0);

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

export const getTotalUndetailedValue = (promotionLots = []) =>
  promotionLots.reduce((totalValue, promotionLot) => {
    const { properties = [] } = promotionLot;
    const property = properties.length && properties[0];

    if (!property) {
      return totalValue;
    }

    const propertyValue = property.value || 0;

    return propertyValue + totalValue;
  }, 0);

export const getFilteredLots = (promotionLots = []) => {
  const availableLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.AVAILABLE);
  const bookedLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.BOOKED);
  const soldLots = promotionLots.filter(({ status }) => status === PROMOTION_LOT_STATUS.SOLD);

  return { availableLots, bookedLots, soldLots };
};

export const getTotalValueByStatus = (promotionLots = [], status) => {
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
  case 'ALL':
    totalValue = [...bookedLots, ...soldLots, ...availableLots].reduce(
      (total, { value }) => total + value,
      0,
    );
    break;

  default:
    break;
  }

  return totalValue;
};
