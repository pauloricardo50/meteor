import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Element, scroller } from 'react-scroll';

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
import { getLotSchema } from '../PromotionAdministration/PromotionAdministrationContainer';
import { usePromotion } from '../PromotionPageContext';

const scrollToAdditionalLotsTable = () => {
  scroller.scrollTo('additional-lots-table', {
    smooth: true,
    delay: 200,
    duration: 500,
    offset: -50,
  });
};

const makeGetModalProps = ({ canModifyLots, lotSchema }) => lot => {
  const disableModal =
    !canModifyLots ||
    [PROMOTION_LOT_STATUS.RESERVED, PROMOTION_LOT_STATUS.SOLD].includes(
      lot.status,
    );

  return {
    disableModal,
    schema: lotSchema,
    model: {
      ...lot,
      promotionLotId: lot.promotionLots?.[0]?._id,
    },
    title: <T id="PromotionPage.modifyLot" />,
    onSubmit: ({ _id: lotId, name, description, value, promotionLotId }) =>
      lotUpdate.run({
        lotId,
        object: { promotionLotId, name, description, value },
      }),
    onDelete: () => lotRemove.run({ lotId: lot._id }),
  };
};

const LotsTable = ({ promotion: { _id: promotionId } }) => {
  const {
    permissions: { canModifyLots },
  } = usePromotion();
  const { formatMessage } = useIntl();
  const lotSchema = useMemo(
    () => getLotSchema({ promotionId, formatMessage }),
    [],
  );
  const getModalProps = makeGetModalProps({ canModifyLots, lotSchema });

  return (
    <Element name="additional-lots-table">
      <div className="card1 p-16">
        <h3>
          <T defaultMessage="Lots annexes" />
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
