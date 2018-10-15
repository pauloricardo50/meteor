// @flow
import React from 'react';
import T from '../../../Translation';
import { toMoney } from '../../../../utils/conversionFunctions';
import Table from '../../../Table';

type UnassignedAdditionalLotsProps = {
  promotion: Object,
};

const columnOptions = [
  { id: 'name' },
  { id: 'type' },
  { id: 'value' },
  { id: 'description' },
].map(({ id }) => ({
  id,
  label: <T id={`PromotionPage.unassignedAdditionalLots.${id}`} />,
}));

const makeMapUnassignedAdditionalLot = () => ({
  _id,
  name,
  type,
  value,
  description,
}) => ({
  id: _id,
  columns: [
    name,
    { raw: type, label: <T id={`Forms.type.${type}`} /> },
    { raw: value, label: toMoney(value) },
    description,
  ],
});

const getUnassignedAdditionalLots = (promotion) => {
  const { promotionLots, lots } = promotion;
  return lots.filter(lot =>
    promotionLots.filter(promotionLot =>
      promotionLot.lots.filter(({ _id }) => lot._id === _id).length > 0).length === 0);
};

const UnassignedAdditionalLots = ({
  promotion,
}: UnassignedAdditionalLotsProps) => {
  const unassignedAdditionalLots = getUnassignedAdditionalLots(promotion);
  return (
    unassignedAdditionalLots.length > 0 && (
      <div className="unassignedAdditionalLots">
        <h3 className="text-center">
          <T id="PromotionPage.unassignedAdditionalLots" />
        </h3>
        <Table
          rows={unassignedAdditionalLots.map(makeMapUnassignedAdditionalLot())}
          columnOptions={columnOptions}
        />
      </div>
    )
  );
};

export default UnassignedAdditionalLots;
