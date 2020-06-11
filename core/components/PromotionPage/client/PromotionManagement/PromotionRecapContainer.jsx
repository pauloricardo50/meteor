import React from 'react';
import moment from 'moment';
import { withProps } from 'recompose';

import { toMoney } from '../../../../utils/conversionFunctions';
import T from '../../../Translation';
import {
  getGroupedLots,
  getTotalAdditionalLotsValue,
  getTotalAdditionalMargin,
  getTotalConstructionValue,
  getTotalLandValue,
  getTotalUndetailedValue,
  getTotalValue,
} from './helpers';

const getRecapArray = (promotion = {}) => {
  const {
    projectStatus,
    authorizationStatus,
    promotionLots = [],
    signingDate,
    type,
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
      label: 'Forms.type',
      value: <T id={`Forms.type.${type}`} />,
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
      value: signingDate ? moment(signingDate).format('D MMMM YYYY') : '-',
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
