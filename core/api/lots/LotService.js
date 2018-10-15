import Lots from './lots';
import CollectionService from '../helpers/CollectionService';

export class LotService extends CollectionService {
  constructor() {
    super(Lots);
  }

  update = ({ lotId, ...rest }) => this._update({ id: lotId, ...rest });
}

export default new LotService();
