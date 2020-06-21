import SecurityService from '../../security';
import {
  addChecklistItem,
  changeItemChecklist,
  incrementChecklistItemStatus,
  removeChecklistItem,
  updateChecklistItem,
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

incrementChecklistItemStatus.setHandler(({ userId }, params) =>
  // TODO: Check user can access checklist
  ChecklistService.incrementItemStatus({
    ...params,
    isAdmin: SecurityService.isUserAdmin(userId),
  }),
);

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
