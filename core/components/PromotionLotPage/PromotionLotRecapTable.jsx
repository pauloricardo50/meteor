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
  propertyValue,
  lots,
}) =>
  (lots.length > 0
    ? [
      {
        label: 'Recap.promotionLot.value',
        spacingTop: true,
        bold: true,
      },
      {
        label: promotionLot.name,
        value: toMoney(propertyValue),
        spacing: false,
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
    ]
    : []);

const getPromotionLotRecapArray = (promotionLot) => {
  const { lots = [], properties } = promotionLot;

  const property = properties.length > 0 && properties[0];
  const {
    value: propertyValue,
    insideArea,
    terraceArea,
    gardenArea,
    roomCount,
    bathroomCount,
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
    ...getPromotionLotValueRecapArray({ lots, propertyValue, promotionLot }),
  ];
};

const PromotionLotRecapTable = ({
  promotionLot,
}: PromotionLotRecapTableProps) => (
  <div className="promotion-lot-recap">
    <RecapSimple
      className="promotion-lot-recap-table"
      array={getPromotionLotRecapArray(promotionLot)}
    />
  </div>
);

export default PromotionLotRecapTable;
