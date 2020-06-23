import { Meteor } from 'meteor/meteor';

import React from 'react';
import { useDrag, useDrop } from 'react-dnd';

import {
  changeItemChecklist,
  updateChecklistOrder,
} from '../../api/checklists/methodDefinitions';
import colors from '../../config/colors';
import ChecklistItemActions from './ChecklistItemActions';
import ChecklistItemContent from './ChecklistItemContent';
import ChecklistItemStatus from './ChecklistItemStatus';

const isAdmin = Meteor.microservice === 'admin';

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

const useDragDrop = ({ itemId, checklistId, itemIds }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { id: itemId, checklistId, type: 'checklistItem' },
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
        itemId,
        replaceId,
        itemIds,
      });
    },
  });
  const [{ isOver }, drop] = useDrop({
    accept: 'checklistItem',
    canDrop: () => true,
    collect: monitor => ({ isOver: monitor.isOver() }),
    drop: () => ({ droppedOnId: itemId, droppedOnChecklistId: checklistId }),
  });

  return { isDragging, isOver, drag, drop };
};

const ChecklistItem = ({ item, checklistId, itemIds }) => {
  const { id: itemId } = item;
  const { isDragging, isOver, drag, drop } = useDragDrop({
    itemId,
    checklistId,
    itemIds,
  });

  return (
    <div
      className="checklist-item flex pb-8 pt-8 animated fadeIn"
      ref={node => drag(drop(node))}
      style={{
        opacity: isDragging ? 0 : 1,
        borderColor: isOver ? colors.primary : 'transparent',
      }}
    >
      <ChecklistItemStatus checklistId={checklistId} item={item} />

      <ChecklistItemContent item={item} />

      {isAdmin && (
        <ChecklistItemActions item={item} checklistId={checklistId} />
      )}
    </div>
  );
};

export default ChecklistItem;
