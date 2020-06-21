import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons/faCheck';
import { faCheckDouble } from '@fortawesome/pro-duotone-svg-icons/faCheckDouble';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle';

import { CHECKLIST_ITEM_STATUS } from '../../api/checklists/checklistConstants';
import { incrementChecklistItemStatus } from '../../api/checklists/methodDefinitions';
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

const ChecklistItem = ({ item, checklistId }) => {
  const { id, title, description, status, statusDate } = item;
  return (
    <div className="flex center-align mb-8">
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
