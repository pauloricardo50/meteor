import { Match } from 'meteor/check';

import { Method } from '../methods/methods';

export const addChecklistItem = new Method({
  name: 'addChecklistItem',
  params: {
    checklistId: String,
    title: String,
    description: Match.Maybe(String),
    requiresDocument: Match.Maybe(Boolean),
  },
});

export const updateChecklistItem = new Method({
  name: 'updateChecklistItem',
  params: {
    access: Match.Maybe(String),
    checklistId: String,
    description: Match.Maybe(String),
    itemId: String,
    requiresDocument: Match.Maybe(Boolean),
    title: Match.Maybe(String),
  },
});

export const incrementChecklistItemStatus = new Method({
  name: 'incrementChecklistItemStatus',
  params: {
    checklistId: String,
    itemId: String,
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
