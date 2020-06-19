import SecurityService from '../../security';
import { CHECKLIST_ITEM_STATUS } from '../checklistConstants';
import {
  addChecklistItem,
  changeItemChecklist,
  removeChecklistItem,
  updateChecklistItem,
  updateChecklistItemStatus,
  updateChecklistOrder,
} from '../methodDefinitions';
import ChecklistService from './ChecklistService';

addChecklistItem.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return ChecklistService.addItem(params);
});

updateChecklistItem.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return ChecklistService.updateItem(params);
});

updateChecklistItemStatus.setHandler(({ userId }, params) => {
  if (params.status === CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN) {
    SecurityService.checkUserIsAdmin(userId);
  } else {
    // TODO: Check user can access checklist
  }
  return ChecklistService.updateItemStatus(params);
});

updateChecklistOrder.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return ChecklistService.reorderItems(params);
});

removeChecklistItem.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return ChecklistService.removeItem(params);
});

changeItemChecklist.setHandler(({ userId }, params) => {
  SecurityService.checkUserIsAdmin(userId);
  return ChecklistService.changeChecklist(params);
});
