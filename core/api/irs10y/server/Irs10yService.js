import { Meteor } from 'meteor/meteor';
import Irs10y from '../irs10y';
import CollectionService from '../../helpers/CollectionService';

class Irs10yService extends CollectionService {
  constructor() {
    super(Irs10y);
  }

  insert({ date, rate }) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const existingFromToday = this.find({
      date: { $gte: start, $lt: end },
    }).fetch();

    if (!existingFromToday || existingFromToday.length === 0) {
      return super.insert({ date, rate });
    }

    throw new Meteor.Error('Un taux existe déjà pour cette date');
  }
}

export default new Irs10yService();
