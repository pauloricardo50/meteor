import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import CollectionService from '../../helpers/server/CollectionService';
import Checklists from '../checklists';

class ChecklistService extends CollectionService {
  constructor() {
    super(Checklists);
  }

  insertTemplate({ template }) {
    const { items, ...data } = template;

    return this.insert({ ...data, items: items.map(this.makeNewItem) });
  }

  makeNewItem(data) {
    const itemId = Random.id();
    return { ...data, id: itemId };
  }

  addItem({ checklistId, title, description }) {
    return this.baseUpdate(checklistId, {
      $push: { items: this.makeNewItem({ title, description }) },
    });
  }

  updateItem({ checklistId, itemId, title, description, access }) {
    return this.baseUpdate(
      { _id: checklistId, 'items.id': itemId },
      {
        $set: {
          'items.$.title': title,
          'items.$.description': description,
          'items.$.updatedAt': new Date(),
          'items.$.access': access,
        },
      },
    );
  }

  updateItemStatus({ checklistId, itemId, status }) {
    const { items } = this.get(checklistId, { items: { id: 1, status: 1 } });

    const item = items.find(({ id }) => id === itemId);
    if (item.status === status) {
      return;
    }

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

  reorderItems({ checklistId, itemIds }) {
    const { items } = this.get(checklistId, { items: 1 });

    if (items.length !== itemIds.length) {
      throw new Meteor.Error(
        'itemIds should have the same length as the item array',
      );
    }

    return this.baseUpdate(checklistId, {
      $set: {
        items: items.sort(
          ({ id: idA }, { id: idB }) =>
            itemIds.indexOf(idA) - itemIds.indexOf(idB),
        ),
      },
    });
  }

  removeItem({ checklistId, itemId }) {
    return this.baseUpdate(checklistId, { $pull: { items: { id: itemId } } });
  }

  changeChecklist({ fromChecklistId, toChecklistId, itemId }) {
    const fromChecklist = this.get(fromChecklistId, { items: 1 });
    const item = fromChecklist.items.find(({ id }) => id === itemId);

    this.removeItem({ checklistId: fromChecklistId, itemId });
    return this.baseUpdate(toChecklistId, { $push: { items: item } });
  }
}

export default new ChecklistService();
