import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Element, scroller } from 'react-scroll';
import SimpleSchema from 'simpl-schema';

import { lotRemove, lotUpdate } from '../../../../api/lots/methodDefinitions';
import { lots } from '../../../../api/lots/queries';
import {
  PROMOTION_LOTS_COLLECTION,
  PROMOTION_LOT_STATUS,
} from '../../../../api/promotionLots/promotionLotConstants';
import withHider from '../../../../containers/withHider';
import DataTable from '../../../DataTable';
import Chip from '../../../Material/Chip';
import StatusLabel from '../../../StatusLabel';
import T, { Money } from '../../../Translation';
import { lotSchema } from '../PromotionAdministration/PromotionAdministrationContainer';
import PromotionMetadataContext from '../PromotionMetadata';

const scrollToAdditionalLotsTable = () => {
  scroller.scrollTo('additional-lots-table', {
    smooth: true,
    delay: 200,
    duration: 500,
    offset: -50,
  });
};

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

const makeGetModalProps = ({ schema, canModifyLots }) => lot => {
  const enableModal =
    canModifyLots &&
    ![PROMOTION_LOT_STATUS.RESERVED, PROMOTION_LOT_STATUS.SOLD].includes(
      lot.status,
    );

  return {
    enableModal,
    schema,
    model: {
      ...lot,
      promotionLot: lot.promotionLots?.length && lot.promotionLots[0]._id,
    },
    title: <T id="PromotionPage.modifyLot" />,
    onSubmit: ({
      _id: lotId,
      name,
      description,
      value,
      promotionLot: promotionLotId,
    }) =>
      lotUpdate.run({
        lotId,
        object: { promotionLotId, name, description, value },
      }),
    onDelete: ({ _id: lotId }) => lotRemove.run({ lotId }),
  };
};

const LotsTable = ({ promotion: { _id: promotionId, promotionLots } }) => {
  const { formatMessage } = useIntl();
  const {
    permissions: { canModifyLots },
  } = useContext(PromotionMetadataContext);
  const schema = useMemo(
    () => additionalLotModifierSchema({ promotionLots, formatMessage }),
    [promotionLots],
  );
  const getModalProps = makeGetModalProps({ schema, canModifyLots });

  return (
    <Element name="additional-lots-table">
      <div className="card1 p-16">
        <h3>
          <T id="PromotionPage.AdditionalLotsTable" />
        </h3>
        <DataTable
          queryConfig={{ query: lots, params: { promotionId } }}
          queryDeps={['promotionId']}
          columns={[
            {
              Header: <T id="PromotionPage.AdditionalLotsTable.name" />,
              accessor: 'name',
            },
            {
              Header: <T id="PromotionPage.AdditionalLotsTable.status" />,
              accessor: 'status',
              Cell: ({ value: status }) => (
                <StatusLabel
                  collection={PROMOTION_LOTS_COLLECTION}
                  status={status}
                />
              ),
            },
            {
              Header: <T id="PromotionPage.AdditionalLotsTable.value" />,
              accessor: 'value',
              Cell: ({ value }) => (
                <b>
                  <Money value={value} />
                </b>
              ),
              align: 'right',
            },
            {
              Header: (
                <T id="PromotionPage.AdditionalLotsTable.allocatedToLot" />
              ),
              accessor: 'promotionLots',
              disableSortBy: true,
              Cell: ({ value: pLots = [] }) =>
                pLots.length ? (
                  pLots.map(
                    ({ name: promotionLotName, _id: promotionLotId }) => (
                      <Chip label={promotionLotName} key={promotionLotId} />
                    ),
                  )
                ) : (
                  <T id="PromotionPage.AdditionalLotsTable.nonAllocated" />
                ),
            },
            {
              Header: <T id="PromotionPage.AdditionalLotsTable.type" />,
              accessor: 'type',
              Cell: ({ value: type }) => <T id={`Forms.type.${type}`} />,
            },
            {
              Header: <T id="PromotionPage.AdditionalLotsTable.description" />,
              accessor: 'description',
              disableSortBy: true,
            },
          ]}
          modalType="form"
          getModalProps={getModalProps}
          initialPageSize={10}
        />
      </div>
    </Element>
  );
};

export default withHider(hide => ({
  style: { alignSelf: 'center' },
  label: hide ? 'Afficher lots annexes' : 'Masquer lots annexes',
  primary: true,
  callback: nextHide => {
    if (!nextHide) {
      scrollToAdditionalLotsTable();
    }
  },
}))(LotsTable);
