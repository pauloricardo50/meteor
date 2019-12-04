import React from 'react';
import { withProps } from 'recompose';
import moment from 'moment';

import { toMoney } from 'core/utils/conversionFunctions';
import {
  getTotalLandValue,
  getTotalConstructionValue,
  getTotalAdditionalMargin,
  getTotalAdditionalLotsValue,
  getTotalValue,
  getTotalUndetailedValue,
  getGroupedLots,
} from './helpers';
import T from '../../../Translation';

const getRecapArray = (promotion = {}) => {
  const {
    projectStatus,
    authorizationStatus,
    promotionLots = [],
    signingDate,
  } = promotion;

  const totalLandValue = getTotalLandValue(promotionLots);
  const totalConstructionValue = getTotalConstructionValue(promotionLots);
  const totalAdditionalMargin = getTotalAdditionalMargin(promotionLots);
  const totalAdditionalLotsValue = getTotalAdditionalLotsValue(promotionLots);
  const totalUndetailedValue = getTotalUndetailedValue(promotionLots);
  const totalValue = getTotalValue(promotionLots);

  const { availableLots, reservedLots, soldLots } = getGroupedLots(
    promotionLots,
  );

  return [
    {
      title: true,
      label: <span>Projet</span>,
      noIntl: true,
    },
    {
      props: { style: { marginTop: 0 } },
      noIntl: true,
    },
    {
      label: 'Forms.projectStatus',
      value: projectStatus,
      hide: !projectStatus,
    },
    {
      label: 'Forms.authorizationStatus',
      value: <T id={`Forms.authorizationStatus.${authorizationStatus}`} />,
      hide: !authorizationStatus,
    },
    {
      label: 'Forms.signingDate',
      value: signingDate ? moment(signingDate).format('Do MMMM YYYY') : '-',
      spacing: true,
    },
    {
      label: 'Recap.landValue',
      value: toMoney(totalLandValue),
      hide: !totalLandValue,
    },
    {
      label: 'Recap.constructionValue',
      value: toMoney(totalConstructionValue),
      hide: !totalConstructionValue,
    },
    {
      label: 'Recap.additionalMargin',
      value: toMoney(totalAdditionalMargin),
      hide: !totalAdditionalMargin,
    },
    {
      label: 'Recap.undetailedValue',
      value: toMoney(totalUndetailedValue),
      hide: !totalUndetailedValue,
    },
    {
      label: 'Recap.additionalLotsValue',
      value: toMoney(totalAdditionalLotsValue),
      hide: !totalAdditionalLotsValue,
    },
    {
      label: 'Recap.promotionValue',
      value: <span className="sum">{toMoney(totalValue)}</span>,
      spacingTop: true,
      spacing: true,
      bold: true,
      hide: !totalValue,
    },
    {
      label: 'Recap.availableLots',
      value: availableLots.length,
    },
    {
      label: 'Recap.reservedLots',
      value: reservedLots.length,
    },
    {
      label: 'Recap.soldLots',
      value: soldLots.length,
    },
  ];
};

export default withProps(({ promotion }) => ({
  recapArray: getRecapArray(promotion),
}));
