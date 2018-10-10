import Lots from './lots';
import CollectionService from '../helpers/CollectionService';

export class LotService extends CollectionService {
  constructor() {
    super(Lots);
  }

  insert = ({ lot = {} }) => super.insert(lot);

  update = ({ lotId, ...rest }) => super.update({ id: lotId, ...rest });
}

export default new LotService();
