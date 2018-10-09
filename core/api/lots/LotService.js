import Lots from './lots';

export class LotService {
  insert = ({ lot = {} }) => Lots.insert(lot);

  update = ({ lotId, object, operator = '$set' }) =>
    Lots.update(lotId, { [operator]: object });
}

export default new LotService();
