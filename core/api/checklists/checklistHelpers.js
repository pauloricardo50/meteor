import { Meteor } from 'meteor/meteor';

import { CHECKLIST_ITEM_STATUS } from './checklistConstants';

export const getChecklistCompletion = checklist => {
  const { items } = checklist;

  const isAdmin = Meteor.microservice === 'admin';

  const doneItems = items.filter(({ status }) =>
    isAdmin
      ? status === CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN
      : [
          CHECKLIST_ITEM_STATUS.VALIDATED,
          CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN,
        ].includes(status),
  );

  return {
    done: doneItems.length,
    total: items.length,
    percent: items.length === 0 ? 0 : doneItems.length / items.length,
  };
};

export const getCompletionRate = checklists => {
  const totalCount = checklists.reduce((l, c) => l + c.items.length, 0);
  return checklists.reduce(
    (obj, checklist) => {
      const result = getChecklistCompletion(checklist);

      return {
        done: obj.done + result.done,
        total: obj.total + result.total,
        percent:
          totalCount === 0
            ? 0
            : obj.percent + (result.percent * result.total) / totalCount,
      };
    },
    { done: 0, total: 0, percent: 0 },
  );
};
