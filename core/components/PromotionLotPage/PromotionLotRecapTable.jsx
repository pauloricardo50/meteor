// @flow
import React from 'react';
import RecapSimple from '../Recap/RecapSimple';
import { toMoney } from '../../utils/conversionFunctions';
import T, { MetricArea } from '../Translation';

type PromotionLotRecapTableProps = {
  promotionLot: Object,
};

const getPromotionLotValueRecapArray = ({
  promotionLot,
  property: {
    value: propertyValue,
    landValue,
    additionalMargin,
    constructionValue,
    totalValue,
  },
  lots,
}) => {
  if (lots.length <= 0) {
    return [];
  }

  return [
    {
      label: 'Recap.promotionLot.value',
      spacingTop: true,
      bold: true,
    },
    {
      label: promotionLot.name,
      value: toMoney(propertyValue),
      spacing: false,
      hide: propertyValue !== totalValue,
    },
    {
      label: (
        <span>
          {promotionLot.name} - <T id="Forms.landValue" />
        </span>
      ),
      value: toMoney(landValue),
      hide: !landValue,
    },
    {
      label: (
        <span>
          {promotionLot.name} - <T id="Forms.constructionValue" />
        </span>
      ),
      value: toMoney(constructionValue),
      hide: !constructionValue,
    },
    {
      label: (
        <span>
          {promotionLot.name} - <T id="Forms.additionalMargin" />
        </span>
      ),
      value: toMoney(additionalMargin),
      hide: !additionalMargin,
    },
    ...lots.map(({ _id, name, type, value }) => ({
      label: (
        <span>
          <T id={`Forms.type.${type}`} /> {name}
        </span>
      ),
      key: _id,
      value: toMoney(value),
      spacing: false,
    })),
    {
      label: 'Recap.promotionLot.totalValue',
      value: toMoney(promotionLot.value),
      bold: true,
    },
  ];
};

const getPromotionLotRecapArray = (promotionLot) => {
  const { lots = [], properties } = promotionLot;
  const property = properties.length > 0 && properties[0];
  const {
    bathroomCount,
    gardenArea,
    insideArea,
    yearlyExpenses,
    roomCount,
    terraceArea,
  } = property;

  return [
    {
      title: true,
      label: 'Recap.promotionLot',
    },
    {
      label: 'Forms.insideArea',
      value: <MetricArea value={insideArea} />,
      hide: !insideArea,
      spacingTop: true,
    },
    {
      label: 'Forms.terraceArea',
      value: <MetricArea value={terraceArea} />,
      hide: !terraceArea,
    },
    {
      label: 'Forms.gardenArea',
      value: <MetricArea value={gardenArea} />,
      hide: !gardenArea,
    },
    {
      label: 'Forms.roomCount',
      value: roomCount,
      hide: !roomCount,
    },
    {
      label: 'Forms.bathroomCount',
      value: bathroomCount,
      hide: !bathroomCount,
    },
    {
      label: 'Forms.yearlyExpenses',
      value: (
        <span>
          {toMoney(yearlyExpenses)} <small>/année</small>
        </span>
      ),
      hide: !yearlyExpenses,
    },
    ...getPromotionLotValueRecapArray({ lots, property, promotionLot }),
  ];
};

const PromotionLotRecapTable = ({
  promotionLot,
}: PromotionLotRecapTableProps) => (
  <div className="promotion-lot-recap validator recap">
    <RecapSimple array={getPromotionLotRecapArray(promotionLot)} />
  </div>
);

export default PromotionLotRecapTable;
