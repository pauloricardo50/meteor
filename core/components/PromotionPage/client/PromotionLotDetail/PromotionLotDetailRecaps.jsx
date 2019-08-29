// @flow
import React from 'react';

import Box from '../../../Box';
import Recap from '../../../Recap';
import T, { MetricArea, Money } from '../../../Translation';

type PromotionLotDetailRecapsProps = {};

const getPromotionLotValueRecapArray = (promotionLot) => {
  const { lots = [], properties } = promotionLot;
  const property = properties.length > 0 && properties[0];

  const {
    value: propertyValue,
    landValue,
    additionalMargin,
    constructionValue,
    totalValue,
  } = property;

  return [
    {
      title: true,
      label: 'Recap.promotionLot.price',
      labelStyle: { textAlign: 'left' },
    },
    {
      label: promotionLot.name,
      value: <Money value={propertyValue} />,
      spacing: false,
      hide: propertyValue !== totalValue,
    },
    {
      label: <T id="Forms.landValue" />,
      value: <Money value={landValue} />,
      hide: !landValue,
    },
    {
      label: <T id="Forms.constructionValue" />,
      value: <Money value={constructionValue} />,
      hide: !constructionValue,
    },
    {
      label: <T id="Forms.additionalMargin" />,
      value: <Money value={additionalMargin} />,
      hide: !additionalMargin,
    },
    ...lots.map(({ _id, name, type, value }) => ({
      label: name,
      key: _id,
      value: <Money value={value} />,
      spacing: false,
    })),
    {
      label: 'Recap.promotionLot.totalValue',
      value: <Money value={promotionLot.value} />,
      bold: true,
      spacingTop: true,
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
      labelStyle: { textAlign: 'left' },
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
          <Money value={yearlyExpenses} />
          {' '}
          <small>/année</small>
        </span>
      ),
      hide: !yearlyExpenses,
    },
  ];
};

const PromotionLotDetailRecaps = ({
  promotionLot,
}: PromotionLotDetailRecapsProps) => (
  <>
    <Box>
      <Recap array={getPromotionLotValueRecapArray(promotionLot)} />
    </Box>
    <Box>
      <Recap array={getPromotionLotRecapArray(promotionLot)} />
    </Box>
  </>
);

export default PromotionLotDetailRecaps;
