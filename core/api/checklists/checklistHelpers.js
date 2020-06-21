import { Meteor } from 'meteor/meteor';

import { CHECKLIST_ITEM_STATUS } from './checklistConstants';

const getCheckistCompletion = checklist => {
  const { items } = checklist;

  const isAdmin = Meteor.microservice === 'admin';

  const doneItems = items.filter(({ status }) =>
    isAdmin
      ? status === CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN
      : status === CHECKLIST_ITEM_STATUS.VALIDATED,
  );

  return {
    done: doneItems.length,
    total: items.length,
    percent: doneItems.length / items.length,
  };
};

export const getCompletionRate = checklists => {
  const totalCount = checklists.reduce((l, c) => l + c.items.length, 0);
  return checklists.reduce(
    (obj, checklist) => {
      const result = getCheckistCompletion(checklist);

      return {
        done: obj.done + result.done,
        total: obj.total + result.total,
        percent: obj.percent + (result.percent * result.total) / totalCount,
      };
    },
    { done: 0, total: 0, percent: 0 },
  );
};
