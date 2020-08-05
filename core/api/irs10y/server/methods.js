import SecurityService from '../../security';
import { irs10yInsert, irs10yRemove, irs10yUpdate } from '../methodDefinitions';
import Irs10yService from './Irs10yService';

irs10yInsert.setHandler((context, { irs10y }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return Irs10yService.insert(irs10y);
});

irs10yRemove.setHandler((context, { irs10yId }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return Irs10yService.remove(irs10yId);
});

irs10yUpdate.setHandler((context, { irs10yId, object }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return Irs10yService._update({ id: irs10yId, object });
});
