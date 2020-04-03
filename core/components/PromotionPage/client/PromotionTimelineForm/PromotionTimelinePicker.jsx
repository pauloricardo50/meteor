import React from 'react';

import { withSmartQuery } from '../../../../api/containerToolkit';
import { reuseConstructionTimeline } from '../../../../api/promotions/methodDefinitions';
import { adminPromotions } from '../../../../api/promotions/queries';
import Button from '../../../Button';
import DropdownMenu from '../../../DropdownMenu';

const PromotionTimelinePicker = ({
  handleOpen,
  hasTimeline,
  promotions = [],
  promotionId,
}) => {
  if (hasTimeline) {
    return (
      <Button primary raised onClick={handleOpen}>
        Répartition du financement
      </Button>
    );
  }

  return <DropdownWithData handleOpen={handleOpen} promotionId={promotionId} />;
};

const Dropdown = ({ handleOpen, promotionId, promotions }) => (
  <DropdownMenu
    button
    options={[
      { id: 'a', label: '+ Nouvelle répartition', onClick: handleOpen },
      ...promotions.map(({ _id, name }) => ({
        id: _id,
        label: name,
        onClick: () =>
          reuseConstructionTimeline
            .run({ fromPromotionId: _id, toPromotionId: promotionId })
            .then(handleOpen),
      })),
    ]}
    buttonProps={{
      label: 'Répartition du financement',
      primary: true,
      raised: true,
    }}
    noWrapper
  />
);

const DropdownWithData = withSmartQuery({
  query: adminPromotions,
  params: { $body: { name: 1 }, hasTimeline: true },
  queryOptions: { shouldRefetch: () => false },
  dataName: 'promotions',
  renderMissingDoc: false,
  refetchOnMethodCall: false,
})(Dropdown);

export default PromotionTimelinePicker;
