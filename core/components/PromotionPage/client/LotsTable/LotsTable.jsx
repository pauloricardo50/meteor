import React, { useContext } from 'react';
import { useIntl } from 'react-intl';
import { Element } from 'react-scroll';
import SimpleSchema from 'simpl-schema';

import { lotRemove, lotUpdate } from '../../../../api/lots/methodDefinitions';
import { PROMOTION_LOT_STATUS } from '../../../../api/promotionLots/promotionLotConstants';
import TableModifier from '../../../TableModifier';
import T from '../../../Translation';
import { lotSchema } from '../PromotionAdministration/PromotionAdministrationContainer';
import PromotionMetadataContext from '../PromotionMetadata';
import LotsTableContainer from './LotsTableContainer';

const additionalLotModifierSchema = ({ promotionLots = [], formatMessage }) =>
  lotSchema.extend(
    new SimpleSchema({
      promotionLot: {
        type: String,
        allowedValues: promotionLots.map(({ _id }) => _id),
        optional: true,
        uniforms: {
          transform: _id =>
            _id ? (
              promotionLots.find(promotionLot => promotionLot._id === _id).name
            ) : (
              <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
            ),
          labelProps: { shrink: true },
          placeholder: formatMessage({
            id: 'PromotionPage.AdditionalLotsTable.nonAllocated',
          }),
        },
      },
    }),
  );

const LotsTable = ({
  rows,
  columnOptions,
  promotion: { promotionLots },
  ...props
}) => {
  const { formatMessage } = useIntl();
  const {
    permissions: { canModifyLots },
  } = useContext(PromotionMetadataContext);
  const schema = additionalLotModifierSchema({ promotionLots, formatMessage });

  return (
    <Element name="additional-lots-table">
      <h3>
        <T id="PromotionPage.AdditionalLotsTable" />
      </h3>
      <TableModifier
        rows={rows}
        columnOptions={columnOptions}
        schema={canModifyLots && schema}
        title={<T id="PromotionPage.modifyLot" />}
        allow={({ status }) =>
          ![PROMOTION_LOT_STATUS.RESERVED, PROMOTION_LOT_STATUS.SOLD].includes(
            status,
          )
        }
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
    </Element>
  );
};

export default LotsTableContainer(LotsTable);
