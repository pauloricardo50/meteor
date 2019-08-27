import { Method } from '../../methods/methods';
import SecurityService from '../../security';
import { irs10yInsert, irs10yRemove, irs10yUpdate } from '../methodDefinitions';
import Irs10yService from './Irs10yService';
import { fetchIrs10y } from './fetchIrs10y';

irs10yInsert.setHandler((context, { irs10y }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return Irs10yService.insert(irs10y);
});

irs10yRemove.setHandler((context, { irs10yId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return Irs10yService.remove(irs10yId);
});

irs10yUpdate.setHandler((context, { irs10yId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return Irs10yService._update({ id: irs10yId, object });
});

export const irs10yFetch = new Method({
  name: 'irs10yFetch',
});

irs10yFetch.setHandler(() =>
  fetchIrs10y()
    .then((irs10y) => {
      Irs10yService.insert({ date: new Date(), rate: irs10y });
      return { rate: irs10y };
    })
    .catch((error) => {
      throw error;
    }));
