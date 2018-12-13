import MortgageNotes from './mortgageNotes';
import CollectionService from '../helpers/CollectionService';

class MortgageNoteService extends CollectionService {
  constructor() {
    super(MortgageNotes);
  }
}

export default new MortgageNoteService();
