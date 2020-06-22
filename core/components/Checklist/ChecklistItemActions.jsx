import React from 'react';

import { CHECKLIST_ITEM_ACCESS } from '../../api/checklists/checklistConstants';
import {
  removeChecklistItem,
  updateChecklistItem,
} from '../../api/checklists/methodDefinitions';
import ConfirmMethod from '../ConfirmMethod';
import IconButton from '../IconButton';
import ChecklistItemForm from '../LoanClosingChecklist/ChecklistItemForm';

const getIconProps = access => {
  if (access === CHECKLIST_ITEM_ACCESS.USER) {
    return {
      type: 'lockOpen',
      tooltip: 'Visible pour le client',
    };
  }

  return {
    type: 'lock',
    iconProps: { color: 'error' },
    tooltip: 'Admin uniquement',
  };
};

const ChecklistItemActions = ({ item, checklistId }) => {
  const { id: itemId, title, description, access, requiresDocument } = item;
  return (
    <div>
      <ChecklistItemForm
        model={{ title, description, requiresDocument }}
        title="Modifier"
        triggerComponent={handleOpen => (
          <IconButton
            type="edit"
            onClick={handleOpen}
            size="small"
            className="mr-4"
            tooltip="Modifier"
          />
        )}
        onSubmit={values =>
          updateChecklistItem.run({ checklistId, itemId, ...values })
        }
      />

      <IconButton
        {...getIconProps(item.access)}
        className="mr-4"
        size="small"
        onClick={() =>
          updateChecklistItem.run({
            checklistId,
            itemId: item.id,
            access: Object.values(CHECKLIST_ITEM_ACCESS).find(
              v => v !== access,
            ),
          })
        }
      />

      <ConfirmMethod
        TriggerComponent={IconButton}
        method={() => removeChecklistItem.run({ checklistId, itemId })}
        buttonProps={{ type: 'close', size: 'small', tooltip: 'Supprimer' }}
        description={
          requiresDocument ? 'Supprimera aussi les fichiers uploadés' : null
        }
      />
    </div>
  );
};

export default ChecklistItemActions;
