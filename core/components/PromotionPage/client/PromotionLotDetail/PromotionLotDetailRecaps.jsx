import { Meteor } from 'meteor/meteor';

import React from 'react';

import Box from '../../../Box';
import Recap from '../../../Recap';
import T, { MetricArea, Money } from '../../../Translation';
import { getPromotionLotValue } from '../PromotionManagement/helpers';

const isApp = Meteor.microservice === 'app';

const getPromotionLotValueRecapArray = promotionLot => {
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
      value: <Money value={isApp ? totalValue : propertyValue} />,
      spacing: false,
      hide: !isApp && propertyValue !== totalValue,
    },
    {
      label: <T defaultMessage="Prix du terrain" />,
      value: <Money value={landValue} />,
      hide: isApp || !landValue,
    },
    {
      label: <T defaultMessage="Coût de la construction" />,
      value: <Money value={constructionValue} />,
      hide: isApp || !constructionValue,
    },
    {
      label: <T defaultMessage="Mise en valeur" />,
      value: <Money value={additionalMargin} />,
      hide: isApp || !additionalMargin,
    },
    ...lots.map(({ _id, name, value }) => ({
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

const getPromotionLotRecapArray = promotionLot => {
  const { properties } = promotionLot;
  const property = properties.length > 0 && properties[0];
  const {
    bathroomCount,
    gardenArea,
    insideArea,
    yearlyExpenses,
    roomCount,
    terraceArea,
    balconyArea,
  } = property;

  return [
    {
      title: true,
      label: 'Recap.promotionLot',
      labelStyle: { textAlign: 'left', marginTop: 0 },
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
      label: 'Forms.balconyArea',
      value: <MetricArea value={balconyArea} />,
      hide: !balconyArea,
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
          <Money value={yearlyExpenses} /> <small>/année</small>
        </span>
      ),
      hide: !yearlyExpenses,
    },
  ];
};

const PromotionLotDetailRecaps = ({ promotionLot }) => {
  const promotionLotValue = getPromotionLotValue(promotionLot);
  const valueRecap = getPromotionLotValueRecapArray(promotionLot);
  const detailsRecap = getPromotionLotRecapArray(promotionLot);

  const shouldShowValue = typeof promotionLotValue === 'number';
  const shouldShowDetails =
    detailsRecap.filter(({ hide }) => hide !== true).length > 1;

  return (
    <>
      {shouldShowValue && (
        <Box>
          <Recap array={valueRecap} />
        </Box>
      )}
      {shouldShowDetails && (
        <Box>
          <Recap array={detailsRecap} />
        </Box>
      )}
    </>
  );
};

export default PromotionLotDetailRecaps;
