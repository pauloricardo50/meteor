/* eslint-env mocha */
import { expect } from 'chai';

import { resetDatabase } from '../../../../utils/testHelpers';
import generator from '../../../factories/server/generator';
import ChecklistService from '../ChecklistService';

describe.only('ChecklistService', () => {
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
});
