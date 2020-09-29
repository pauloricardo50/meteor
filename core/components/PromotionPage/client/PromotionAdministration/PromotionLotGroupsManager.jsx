import React, { useMemo } from 'react';
import { withProps } from 'recompose';

import { proPromotionLots } from '../../../../api/promotionLots/queries';
import {
  addPromotionLotGroup,
  removePromotionLotGroup,
  updatePromotionLotGroup,
} from '../../../../api/promotions/methodDefinitions';
import useMeteorData from '../../../../hooks/useMeteorData';
import AutoFormDialog from '../../../AutoForm2/AutoFormDialog';
import ConfirmMethod from '../../../ConfirmMethod';
import Table from '../../../DataTable/Table';
import Icon from '../../../Icon';
import IconButton from '../../../IconButton';
import T from '../../../Translation';
import { promotionLotGroupSchema } from './PromotionAdministrationContainer';

const PromotionLotGroupAdder = ({ promotionId }) => (
  <AutoFormDialog
    schema={promotionLotGroupSchema}
    buttonProps={{
      secondary: true,
      raised: true,
      icon: <Icon type="add" />,
      label: <T id="Forms.promotionLotGroup" />,
      className: 'mt-16',
    }}
    title={<T id="PromotionAdministration.addPromotionLotGroup" />}
    description={
      <T id="PromotionAdministration.addPromotionLotGroup.description" />
    }
    onSubmit={({ label }) => addPromotionLotGroup.run({ promotionId, label })}
  />
);

const makeMapPromotionLotGroup = promotionId => ({ id, label }) => ({
  id,
  label,
  actions: (
    <div className="flex">
      <AutoFormDialog
        schema={promotionLotGroupSchema}
        triggerComponent={handleOpen => (
          <IconButton
            onClick={handleOpen}
            secondary
            raised
            type="edit"
            tooltip={<T id="general.modify" />}
            size="small"
            className="mr-4"
          />
        )}
        model={{ label }}
        title={<T id="PromotionLotGroupsManager.modify" />}
        description={<T id="PromotionLotGroupsManager.modify.description" />}
        onSubmit={({ label: newLabel }) =>
          updatePromotionLotGroup.run({
            promotionId,
            promotionLotGroupId: id,
            label: newLabel,
          })
        }
      />
      <ConfirmMethod
        TriggerComponent={IconButton}
        buttonProps={{
          type: 'delete',
          tooltip: <T id="general.delete" />,
          className: 'error',
          size: 'small',
        }}
        description={<T id="PromotionLotGroupsManager.delete" />}
        method={() =>
          removePromotionLotGroup.run({ promotionId, promotionLotGroupId: id })
        }
      />
    </div>
  ),
});

const PromotionLotGroupsManager = ({
  columns,
  data,
  promotion: { _id: promotionId },
}) => (
  <div className="flex-col">
    {data.length > 0 && <Table columns={columns} data={data} />}
    <PromotionLotGroupAdder promotionId={promotionId} />
  </div>
);

export default withProps(
  ({ promotion: { _id: promotionId, promotionLotGroups = [] } }) => {
    const { data: promotionLots = [] } = useMeteorData({
      query: proPromotionLots,
      params: { promotionId, $body: { promotionLotGroupIds: 1 } },
    });
    const columns = useMemo(() => [
      { Header: <T defaultMessage="Groupe de lots" />, accessor: 'label' },
      {
        Header: <T defaultMessage="Nombre de lots" />,
        accessor: 'id',
        Cell: ({ value: id }) =>
          promotionLots.reduce(
            (count, { promotionLotGroupIds = [] }) =>
              promotionLotGroupIds.some(groupId => groupId === id)
                ? count + 1
                : count,
            0,
          ),
      },
      {
        Header: <T defaultMessage="Actions" />,
        accessor: 'actions',
        disableSortBy: true,
      },
    ]);

    const data = useMemo(
      () => promotionLotGroups.map(makeMapPromotionLotGroup(promotionId)),
      [promotionLotGroups],
    );

    return {
      columns,
      data,
    };
  },
)(PromotionLotGroupsManager);
