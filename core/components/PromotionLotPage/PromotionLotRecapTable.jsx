// @flow
import React from 'react';
import RecapSimple from '../Recap/RecapSimple';
import { toMoney } from '../../utils/conversionFunctions';
import T from '../Translation';

type PromotionLotRecapTableProps = {
  promotionLot: Object,
};

const getPromotionLotRecapArray = (promotionLot) => {
  const { lots, properties } = promotionLot;
  const promotionLotValue = properties.length > 0 && properties[0].value;
  return [
    {
      label: promotionLot.name,
      value: toMoney(promotionLotValue),
      spacing: false,
    },
    ...lots.map(({ name, type, value }) => ({
      label: (
        <span>
          <T id={`Forms.type.${type}`} /> {name}
        </span>
      ),
      value: toMoney(value),
      spacing: false,
    })),
    {
      label: <T id="Financing.totalFiscal" />,
      value: toMoney(promotionLot.value),
      spacingTop: true,
      bold: true,
    },
  ];
};

const PromotionLotRecapTable = ({
  promotionLot,
}: PromotionLotRecapTableProps) => (
  <RecapSimple
    className="promotion-lot-recap-table"
    array={getPromotionLotRecapArray(promotionLot)}
  />
);

export default PromotionLotRecapTable;
