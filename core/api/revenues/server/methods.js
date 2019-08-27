import SecurityService from '../../security';
import RevenueService from './RevenueService';
import {
  revenueInsert,
  revenueRemove,
  revenueUpdate,
  consolidateRevenue,
  consolidateCommission,
} from '../methodDefinitions';

revenueInsert.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.insert(params);
});

revenueRemove.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.remove(params);
});

revenueUpdate.setHandler((context, { revenueId, object }) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService._update({ id: revenueId, object });
});

consolidateRevenue.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.consolidateRevenue(params);
});

consolidateCommission.setHandler((context, params) => {
  SecurityService.checkCurrentUserIsAdmin();
  return RevenueService.consolidateCommission(params);
});
