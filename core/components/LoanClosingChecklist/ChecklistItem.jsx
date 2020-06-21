import { Meteor } from 'meteor/meteor';

import React from 'react';
import { faCheck } from '@fortawesome/pro-duotone-svg-icons/faCheck';
import { faCheckDouble } from '@fortawesome/pro-duotone-svg-icons/faCheckDouble';
import { faCircle } from '@fortawesome/pro-duotone-svg-icons/faCircle';

import { CHECKLIST_ITEM_STATUS } from '../../api/checklists/checklistConstants';
import { updateChecklistItemStatus } from '../../api/checklists/methodDefinitions';
import colors from '../../config/colors';
import DropdownMenu from '../DropdownMenu';
import { FaIcon } from '../Icon';
import T from '../Translation';
import ChecklistItemActions from './ChecklistItemActions';

const isApp = Meteor.microservice === 'app';
const isAdmin = Meteor.microservice === 'admin';

const getDropdownConfig = status => {
  if (status === CHECKLIST_ITEM_STATUS.TO_DO) {
    return {
      iconType: <FaIcon icon={faCircle} color={colors.duotoneIconColor} />,
    };
  }

  if (status === CHECKLIST_ITEM_STATUS.VALIDATED) {
    return {
      iconType: <FaIcon icon={faCheck} color={colors.success} />,
    };
  }

  return {
    iconType: <FaIcon icon={faCheckDouble} color={colors.success} />,
  };
};

const getOptions = (itemId, checklistId) => {
  const options = [
    {
      label: <T id="Checklist.TO_DO" />,
      onClick: () =>
        updateChecklistItemStatus.run({
          itemId,
          checklistId,
          status: CHECKLIST_ITEM_STATUS.TO_DO,
        }),
    },
    {
      label: <T id="Checklist.VALIDATED" />,
      onClick: () =>
        updateChecklistItemStatus.run({
          itemId,
          checklistId,
          status: CHECKLIST_ITEM_STATUS.VALIDATED,
        }),
    },
  ];
  if (isAdmin) {
    options.push({
      label: <T id="Checklist.VALIDATED_BY_ADMIN" />,
      onClick: () =>
        updateChecklistItemStatus.run({
          itemId,
          checklistId,
          status: CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN,
        }),
    });
  }

  return options;
};

const ChecklistItem = ({ item, checklistId }) => {
  const { id, title, description, status } = item;
  return (
    <div className="flex center-align mb-8">
      <DropdownMenu
        noWrapper
        buttonProps={{ size: 'small', className: 'mr-8' }}
        disabled={isApp && status === CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN}
        options={getOptions(id, checklistId)}
        {...getDropdownConfig(status)}
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
