import { Meteor } from 'meteor/meteor';

import MortgageNotes from '../mortgageNotes';
import CollectionService from '../../helpers/CollectionService';
import { mortgageNote as mortgageNoteFragment } from '../../fragments';

class MortgageNoteService extends CollectionService {
  constructor() {
    super(MortgageNotes);
    this.get = this.makeGet(mortgageNoteFragment());
  }

  insert({ mortgageNote = {}, propertyId, borrowerId }) {
    if (!borrowerId && !propertyId) {
      throw new Meteor.Error(
        'Une cédule doit être liée à un emprunteur ou bien immo',
      );
    }

    const id = super.insert(mortgageNote);

    if (borrowerId) {
      this.addLink({ id, linkName: 'borrower', linkId: borrowerId });
    }
    if (propertyId) {
      this.addLink({ id, linkName: 'property', linkId: propertyId });
    }

    return id;
  }
}

export default new MortgageNoteService();
