import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

import CollectionService from '../../helpers/server/CollectionService';
import LoanService from '../../loans/server/LoanService';
import {
  CHECKLIST_ITEM_ACCESS,
  CHECKLIST_ITEM_STATUS,
} from '../checklistConstants';
import Checklists from '../checklists';

class ChecklistService extends CollectionService {
  constructor() {
    super(Checklists);
  }

  insertTemplate({ template, closingLoanId }) {
    const { items, ...data } = template;
    const mappedItems = items.map(this.makeNewItem);

    const checklistId = this.insert({ ...data, items: mappedItems });
    this.addLink({
      id: checklistId,
      linkName: 'closingLoan',
      linkId: closingLoanId,
    });

    mappedItems
      .filter(({ requiresDocument }) => requiresDocument)
      .forEach(({ id: itemId }) => {
        this.addAdditionalDocument({ checklistId, itemId });
      });

    return checklistId;
  }

  makeNewItem(data) {
    const itemId = Random.id();
    return { ...data, id: itemId };
  }

  addItem({ checklistId, title, description, requiresDocument }) {
    const newItem = this.makeNewItem({ title, description, requiresDocument });
    this.baseUpdate(checklistId, { $push: { items: newItem } });

    if (requiresDocument) {
      this.addAdditionalDocument({ checklistId, itemId: newItem.id });
    }

    return newItem.id;
  }

  getItem({ checklistId, itemId }) {
    if (!itemId) {
      return;
    }

    let selector = { items: { $elemMatch: { id: itemId } } };
    if (checklistId) {
      selector = checklistId;
    }

    const result = this.get(selector, { items: 1 });
    return result.items.find(({ id }) => id === itemId);
  }

  updateItem({
    checklistId,
    itemId,
    title,
    description,
    access,
    requiresDocument,
  }) {
    const result = this.baseUpdate(
      { _id: checklistId, 'items.id': itemId },
      {
        $set: {
          'items.$.title': title,
          'items.$.description': description,
          'items.$.updatedAt': new Date(),
          'items.$.access': access,
          'items.$.requiresDocument': requiresDocument,
        },
      },
    );
    const item = this.getItem({ itemId });

    if (item.requiresDocument) {
      this.addAdditionalDocument({ checklistId, itemId });
    }

    if (!item.requiresDocument) {
      this.removeAdditionalDoc({ checklistId, itemId });
    }

    this.updateAdditionalDocument({ itemId });

    return result;
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

  incrementItemStatus({ checklistId, itemId, isAdmin }) {
    const { items } = this.get(checklistId, { items: { id: 1, status: 1 } });
    const { status } = items.find(({ id }) => id === itemId);

    let nextStatus;

    if (status === CHECKLIST_ITEM_STATUS.TO_DO) {
      nextStatus = isAdmin
        ? CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN
        : CHECKLIST_ITEM_STATUS.VALIDATED;
    } else if (status === CHECKLIST_ITEM_STATUS.VALIDATED) {
      nextStatus = isAdmin
        ? CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN
        : CHECKLIST_ITEM_STATUS.TO_DO;
    } else {
      // VALIDATED_BY_ADMIN
      nextStatus = isAdmin ? CHECKLIST_ITEM_STATUS.TO_DO : status;
    }

    if (nextStatus === status) return;

    return this.baseUpdate(
      { _id: checklistId, 'items.id': itemId },
      {
        $set: {
          'items.$.status': nextStatus,
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

  removeItem({ checklistId, itemId, keepAdditionalDoc }) {
    const result = this.baseUpdate(checklistId, {
      $pull: { items: { id: itemId } },
    });

    if (!keepAdditionalDoc) {
      this.removeAdditionalDoc({ checklistId, itemId });
    }

    return result;
  }

  changeChecklist({ fromChecklistId, toChecklistId, itemId }) {
    const fromChecklist = this.get(fromChecklistId, { items: 1 });
    const item = fromChecklist.items.find(({ id }) => id === itemId);

    this.removeItem({
      checklistId: fromChecklistId,
      itemId,
      keepAdditionalDoc: true,
    });
    this.baseUpdate(toChecklistId, { $push: { items: item } });
    return this.get(toChecklistId, { items: { id: 1 } }).items.map(
      ({ id }) => id,
    );
  }

  addAdditionalDocument({ checklistId, itemId }) {
    const { closingLoan, items } = this.get(checklistId, {
      closingLoan: { _id: 1, additionalDocuments: 1 },
      items: 1,
    });
    const item = items.find(({ id }) => id === itemId);

    if (
      closingLoan?._id &&
      !closingLoan.additionalDocuments.find(
        ({ checklistItemId }) => checklistItemId === itemId,
      )
    ) {
      LoanService.baseUpdate(closingLoan._id, {
        $push: {
          additionalDocuments: {
            id: Random.id(),
            label: item.title,
            category: 'CLOSING',
            requiredByAdmin: item.access === CHECKLIST_ITEM_ACCESS.USER,
            tooltip: item.description,
            checklistItemId: itemId,
          },
        },
      });
    }
  }

  updateAdditionalDocument({ itemId }) {
    const { closingLoan, items } = this.get(
      { items: { $elemMatch: { id: itemId } } },
      { items: 1, closingLoan: { _id: 1 } },
    );
    const item = items.find(({ id }) => id === itemId);

    if (item.requiresDocument && closingLoan?._id) {
      LoanService.baseUpdate(
        {
          _id: closingLoan._id,
          'additionalDocuments.checklistItemId': itemId,
        },
        {
          $set: {
            'additionalDocuments.$.requiredByAdmin':
              item.access === CHECKLIST_ITEM_ACCESS.USER,
            'additionalDocuments.$.label': item.title,
            'additionalDocuments.$.tooltip': item.description,
          },
        },
      );
    }
  }

  removeAdditionalDoc({ checklistId, itemId }) {
    const { closingLoan } = this.get(checklistId, {
      closingLoan: { _id: 1, additionalDocuments: 1 },
    });

    if (closingLoan?._id) {
      const additionalDoc = closingLoan.additionalDocuments.find(
        ({ checklistItemId }) => checklistItemId === itemId,
      );

      if (additionalDoc) {
        LoanService.removeAdditionalDoc({
          id: closingLoan._id,
          additionalDocId: additionalDoc.id,
        });
      }
    }
  }
}

export default new ChecklistService();
