/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server/generator';
import { CHECKLIST_ITEM_STATUS } from '../../checklistConstants';
import ChecklistService from '../ChecklistService';

describe('ChecklistService', () => {
  beforeEach(() => {
    resetDatabase();
  });

  it('inserts a checklist', () => {
    const result = ChecklistService.insert({
      title: 'do stuff',
      description: 'hey',
    });
    expect(typeof result).to.equal('string');
    const checklist = ChecklistService.get(result, {
      title: 1,
      description: 1,
      createdAt: 1,
      updatedAt: 1,
      items: 1,
    });

    expect(checklist.title).to.equal('do stuff');
    expect(checklist.description).to.equal('hey');
    expect(checklist.createdAt).to.not.equal(undefined);
    expect(checklist.updatedAt).to.not.equal(undefined);
    expect(checklist.items).to.deep.equal([]);
  });

  describe('addItem', () => {
    it('adds an item to the checklist', () => {
      generator({
        checklists: [
          { _id: 'c1' },
          { _id: 'c2', items: [{ id: 'a', title: 'yo' }] },
        ],
      });

      ChecklistService.addItem({ checklistId: 'c2', title: 'do stuff' });

      const checklist = ChecklistService.get('c2', { items: 1 });
      expect(checklist.items.length).to.equal(2);
      expect(checklist.items[0].id).to.equal('a');
      expect(checklist.items[1].title).to.equal('do stuff');
    });
  });

  describe('updateItem', () => {
    it('updates an item in the list', () => {
      const start = new Date();
      generator({
        checklists: [
          { _id: 'c1' },
          {
            _id: 'c2',
            items: [
              { id: 'a', title: 'yo' },
              { id: 'b', title: 'yo2', updatedAt: start },
            ],
          },
        ],
      });

      ChecklistService.updateItem({
        checklistId: 'c2',
        itemId: 'b',
        title: 'yo3',
        description: 'hey',
      });

      const checklist = ChecklistService.get('c2', { items: 1 });
      expect(checklist.items.length).to.equal(2);
      expect(checklist.items[0].title).to.equal('yo');
      expect(checklist.items[1].title).to.equal('yo3');
      expect(checklist.items[1].description).to.equal('hey');
      expect(checklist.items[1].updatedAt.getTime()).to.not.equal(
        start.getTime(),
      );
    });
  });

  describe('updateItemStatus', () => {
    it('updates the status and statusDate, but not updatedAt', () => {
      const start = new Date();
      generator({
        checklists: [
          { _id: 'c1' },
          {
            _id: 'c2',
            items: [
              { id: 'a', title: 'yo' },
              { id: 'b', title: 'yo2', updatedAt: start, statusDate: start },
            ],
          },
        ],
      });

      ChecklistService.updateItemStatus({
        checklistId: 'c2',
        itemId: 'b',
        status: CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN,
      });

      const checklist = ChecklistService.get('c2', { items: 1 });
      expect(checklist.items[1].status).to.equal(
        CHECKLIST_ITEM_STATUS.VALIDATED_BY_ADMIN,
      );
      expect(checklist.items[1].statusDate.getTime()).to.be.above(
        start.getTime(),
      );
      expect(checklist.items[1].updatedAt.getTime()).to.equal(start.getTime());
    });
  });

  describe('reorderItems', () => {
    it('throws if you pass a differently sized array', () => {
      generator({
        checklists: {
          _id: 'check',
          items: [
            { id: 'a', title: 'a' },
            { id: 'b', title: 'b' },
            { id: 'c', title: 'c' },
          ],
        },
      });

      expect(() =>
        ChecklistService.reorderItems({
          checklistId: 'check',
          itemIds: ['b', 'c'],
        }),
      ).to.throw('same length');
    });

    it('reorders items in the array', () => {
      generator({
        checklists: {
          _id: 'check',
          items: [
            { id: 'a', title: 'a' },
            { id: 'b', title: 'b' },
            { id: 'c', title: 'c' },
          ],
        },
      });

      ChecklistService.reorderItems({
        checklistId: 'check',
        itemIds: ['b', 'c', 'a'],
      });

      const { items } = ChecklistService.get('check', { items: 1 });
      expect(items[0].id).to.equal('b');
      expect(items[1].id).to.equal('c');
      expect(items[2].id).to.equal('a');
    });
  });

  describe('removeItem', () => {
    it('removes the right item in the checklist', () => {
      generator({
        checklists: [
          { _id: 'c1' },
          {
            _id: 'c2',
            items: [
              { id: 'a', title: 'a' },
              { id: 'b', title: 'b' },
              { id: 'c', title: 'c' },
            ],
          },
        ],
      });

      ChecklistService.removeItem({ checklistId: 'c2', itemId: 'b' });

      const { items } = ChecklistService.get('c2', { items: 1 });
      expect(items.length).to.equal(2);
      expect(items[0].id).to.equal('a');
      expect(items[1].id).to.equal('c');
    });
  });

  describe('changeChecklist', () => {
    it('changes the checklist of an item', () => {
      generator({
        checklists: [
          { _id: 'c1', items: [{ id: 'a1', title: 'a1' }] },
          {
            _id: 'c2',
            items: [
              { id: 'a2', title: 'a2' },
              { id: 'b2', title: 'b2' },
            ],
          },
        ],
      });

      ChecklistService.changeChecklist({
        fromChecklistId: 'c2',
        toChecklistId: 'c1',
        itemId: 'b2',
      });

      const checklist1 = ChecklistService.get('c1', { items: 1 });
      const checklist2 = ChecklistService.get('c2', { items: 1 });

      expect(checklist1.items.length).to.equal(2);
      expect(checklist2.items.length).to.equal(1);
      expect(checklist1.items[0].id).to.equal('a1');
      expect(checklist1.items[1].id).to.equal('b2');
      expect(checklist2.items[0].id).to.equal('a2');
    });
  });
});
