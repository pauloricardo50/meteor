import SecurityService from '../../security';
import RevenueService from './RevenueService';
import {
  revenueInsert,
  revenueRemove,
  revenueUpdate,
} from '../methodDefinitions';

revenueInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.insert(params);
});

revenueRemove.setHandler((context, { revenueId }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.remove(revenueId);
});

revenueUpdate.setHandler((context, { revenueId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService._update({ id: revenueId, object });
});
