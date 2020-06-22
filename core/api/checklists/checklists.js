import SimpleSchema from 'simpl-schema';

import { createCollection } from '../helpers/collectionHelpers';
import { cacheField, createdAt, updatedAt } from '../helpers/sharedSchemas';
import {
  CHECKLISTS_COLLECTION,
  CHECKLIST_ITEM_ACCESS,
  CHECKLIST_ITEM_STATUS,
} from './checklistConstants';

const ChecklistSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  title: { type: String, optional: true },
  description: { type: String, optional: true },
  items: { type: Array, defaultValue: [] },
  'items.$': Object,
  'items.$.id': String,
  'items.$.updatedAt': { type: Date, defaultValue: new Date() },
  'items.$.title': String,
  'items.$.description': { type: String, optional: true },
  'items.$.status': {
    type: String,
    allowedValues: Object.values(CHECKLIST_ITEM_STATUS),
    defaultValue: CHECKLIST_ITEM_STATUS.TO_DO,
  },
  'items.$.statusDate': { type: Date, defaultValue: new Date() },
  'items.$.requiresDocument': { type: Boolean, optional: true },
  'items.$.access': {
    type: String,
    allowedValues: Object.values(CHECKLIST_ITEM_ACCESS),
    defaultValue: CHECKLIST_ITEM_ACCESS.USER,
  },
  closingLoanCache: { type: Array, optional: true },
  'closingLoanCache.$': cacheField,
});

const Checklists = createCollection(CHECKLISTS_COLLECTION, ChecklistSchema);

export default Checklists;
