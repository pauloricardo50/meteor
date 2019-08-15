// @flow
import React, { useContext } from 'react';
import SimpleSchema from 'simpl-schema';

import { PROMOTION_LOT_STATUS } from 'core/api/constants';
import { lotRemove, lotUpdate } from '../../../../api/methods';
import T from '../../../Translation';
import LotsTableContainer from './LotsTableContainer';
import TableModifier from '../../../TableModifier';
import { lotSchema } from '../PromotionAdministration/PromotionAdministration';
import PromotionMetadataContext from '../PromotionMetadata';

type LotsTableProps = {};

const AdditionalLotModifierSchema = (promotionLots = []) =>
  lotSchema.extend(new SimpleSchema({
    promotionLot: {
      type: String,
      allowedValues: promotionLots.map(({ _id }) => _id),
      optional: true,
      uniforms: {
        transform: _id =>
          (_id ? (
            promotionLots.find(promotionLot => promotionLot._id === _id).name
          ) : (
            <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
          )),
        labelProps: { shrink: true },
        placeholder: 'Non alloué',
      },
    },
  }));

const LotsTable = ({
  rows,
  columnOptions,
  promotion: { promotionLots },
  ...props
}: LotsTableProps) => {
  const {
    permissions: { canModifyLots },
  } = useContext(PromotionMetadataContext);
  const schema = AdditionalLotModifierSchema(promotionLots);

  return (
    <>
      <h3>
        <T id="PromotionPage.AdditionalLotsTable" />
      </h3>
      <TableModifier
        rows={rows}
        columnOptions={columnOptions}
        schema={canModifyLots && schema}
        title={<T id="PromotionPage.modifyLot" />}
        allow={({ status }) => status === PROMOTION_LOT_STATUS.AVAILABLE}
        onSubmit={({
          _id: lotId,
          name,
          description,
          value,
          promotionLot: promotionLotId,
        }) =>
          lotUpdate.run({
            lotId,
            object: { promotionLotId, name, description, value },
          })
        }
        onDelete={({ _id: lotId }) => lotRemove.run({ lotId })}
        {...props}
      />
    </>
  );
};

export default LotsTableContainer(LotsTable);
