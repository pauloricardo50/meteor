import ServerEventService from '../../events/server/ServerEventService';
import { handleSuccessfulUpload } from '../../files/methodDefinitions';
import SecurityService from '../../security';
import { CHECKLIST_ITEM_STATUS } from '../checklistConstants';
import ChecklistService from './ChecklistService';

// Automatically mark a checklist item as done if a new file is uploaded
ServerEventService.addAfterMethodListener(
  handleSuccessfulUpload,
  ({ context, params: { fileMeta } }) => {
    if (fileMeta.checklistItemId) {
      const { _id: checklistId, items } = ChecklistService.get(
        { items: { $elemMatch: { id: fileMeta.checklistItemId } } },
        { items: { id: 1, status: 1 } },
      );
      const item = items.find(({ id }) => id === fileMeta.checklistItemId);

      if (item?.status === CHECKLIST_ITEM_STATUS.TO_DO) {
        ChecklistService.incrementItemStatus({
          checklistId,
          itemId: fileMeta.checklistItemId,
          isAdmin: SecurityService.isUserAdmin(context.userId),
        });
      }
    }
  },
);
