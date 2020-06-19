import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const addChecklistItem = new Method({
  name: 'addChecklistItem',
  params: {
    checklistId: String,
    title: String,
    description: Match.Maybe(String),
  },
});

export const updateChecklistItem = new Method({
  name: 'updateChecklistItem',
  params: {
    checklistId: String,
    itemId: String,
    title: Match.Maybe(String),
    description: Match.Maybe(String),
    access: Match.Maybe(String),
  },
});

export const updateChecklistItemStatus = new Method({
  name: 'updateChecklistItemStatus',
  params: {
    checklistId: String,
    itemId: String,
    status: String,
  },
});

export const updateChecklistOrder = new Method({
  name: 'updateChecklistOrder',
  params: {
    checklistId: String,
    itemIds: [String],
  },
});

export const removeChecklistItem = new Method({
  name: 'removeChecklistItem',
  params: {
    checklistId: String,
    itemId: String,
  },
});

export const changeItemChecklist = new Method({
  name: 'changeItemChecklist',
  params: {
    fromChecklistId: String,
    toChecklistId: String,
    itemId: String,
  },
});
