import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons/faCheck';
import { faCheckDouble } from '@fortawesome/pro-duotone-svg-icons/faCheckDouble';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle';
import { useDrag, useDrop } from 'react-dnd';

import { CHECKLIST_ITEM_STATUS } from '../../api/checklists/checklistConstants';
import {
  changeItemChecklist,
  incrementChecklistItemStatus,
  updateChecklistOrder,
} from '../../api/checklists/methodDefinitions';
import colors from '../../config/colors';
import { FaIcon } from '../Icon';
import IconButton from '../IconButton';
import T, { IntlDate } from '../Translation';
import ChecklistItemActions from './ChecklistItemActions';

const isApp = Meteor.microservice === 'app';
const isAdmin = Meteor.microservice === 'admin';

const getDropdownConfig = status => {
  if (status === CHECKLIST_ITEM_STATUS.TO_DO) {
    return {
      type: <FaIcon icon={faCircle} color={colors.primary} />,
    };
  }

  if (status === CHECKLIST_ITEM_STATUS.VALIDATED) {
    return {
      type: <FaIcon icon={faCheck} color={colors.success} />,
    };
  }

  return {
    type: <FaIcon icon={faCheckDouble} color={colors.success} />,
  };
};

const moveItem = async ({
  fromChecklistId,
  toChecklistId,
  itemId,
  replaceId,
  itemIds,
}) => {
  if (fromChecklistId !== toChecklistId) {
    itemIds = await changeItemChecklist.run({
      toChecklistId,
      fromChecklistId,
      itemId,
    });
  }
  const currentIndex = itemIds.indexOf(itemId);
  const replacingIndex = itemIds.indexOf(replaceId);
  itemIds.splice(currentIndex, 1);
  itemIds.splice(replacingIndex, 0, itemId);
  updateChecklistOrder.run({ checklistId: toChecklistId, itemIds });
};

const ChecklistItem = ({ item, checklistId, itemIds }) => {
  const { id, title, description, status, statusDate } = item;
  const [{ isDragging }, drag] = useDrag({
    item: { id, checklistId, type: 'checklistItem' },
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end: (_, monitor) => {
      if (!monitor.didDrop()) {
        return;
      }

      const {
        droppedOnId: replaceId,
        droppedOnChecklistId,
      } = monitor.getDropResult();
      moveItem({
        fromChecklistId: checklistId,
        toChecklistId: droppedOnChecklistId,
        itemId: id,
        replaceId,
        itemIds,
      });
    },
  });
  const [{ isOver }, drop] = useDrop({
    accept: 'checklistItem',
    canDrop: () => true,
    collect: monitor => ({ isOver: monitor.isOver() }),
    drop: () => ({ droppedOnId: id, droppedOnChecklistId: checklistId }),
  });

  return (
    <div
      className="checklist-item flex center-align pb-4 pt-4 animated fadeIn"
      ref={node => drag(drop(node))}
      style={{
        opacity: isDragging ? 0 : 1,
        border: `solid 1px ${isOver ? colors.primary : 'white'}`,
        boxSizing: 'content-box',
      }}
    >
      <IconButton
        {...getDropdownConfig(status)}
        onClick={() =>
          incrementChecklistItemStatus.run({ checklistId, itemId: id })
        }
        className="mr-8"
        size="small"
        disabled={isApp && status === CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN}
        tooltip={
          <T
            id="LoanClosingChecklist.statusDateTooltip"
            values={{
              date: <IntlDate value={statusDate} />,
              time: <IntlDate value={statusDate} type="time" />,
            }}
          />
        }
      />

      <div style={{ flexGrow: 1, maxWidth: 300 }}>
        <h5 className="m-0">{title}</h5>
        {description && <p className="secondary m-0">{description}</p>}
      </div>

      {isAdmin && (
        <ChecklistItemActions item={item} checklistId={checklistId} />
      )}
    </div>
  );
};

export default ChecklistItem;
