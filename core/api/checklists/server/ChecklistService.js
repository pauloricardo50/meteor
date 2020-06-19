import { Random } from 'meteor/random';

import CollectionService from '../../helpers/server/CollectionService';
import Checklists from '../checklists';

class ChecklistService extends CollectionService {
  constructor() {
    super(Checklists);
  }

  addItem({ checklistId, title, description }) {
    const itemId = Random.id();

    return this.baseUpdate(checklistId, {
      $push: { items: { title, description, id: itemId } },
    });
  }

  updateItem({ checklistId, itemId, title, description }) {
    return this.baseUpdate(
      { _id: checklistId, 'items.id': itemId },
      {
        $set: {
          'items.$.title': title,
          'items.$.description': description,
          'items.$.updatedAt': new Date(),
        },
      },
    );
  }

  updateItemStatus({ checklistId, itemId, status }) {
    return this.baseUpdate(
      { _id: checklistId, 'items.id': itemId },
      {
        $set: {
          'items.$.status': status,
          'items.$.statusDate': new Date(),
        },
      },
    );
  }

  reorderItems({ checklistId, itemIds }) {}
}

export default new ChecklistService();
