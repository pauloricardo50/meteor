import SecurityService from '../../security';
import {
  consolidateCommission,
  consolidateRevenue,
  revenueInsert,
  revenueRemove,
  revenueUpdate,
} from '../methodDefinitions';
import RevenueService from './RevenueService';

revenueInsert.setHandler((context, params) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return RevenueService.insert(params);
});

revenueRemove.setHandler((context, params) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return RevenueService.remove(params);
});

revenueUpdate.setHandler((context, { revenueId, object }) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return RevenueService._update({ id: revenueId, object });
});

consolidateRevenue.setHandler((context, params) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return RevenueService.consolidateRevenue(params);
});

consolidateCommission.setHandler((context, params) => {
  SecurityService.checkUserIsAdmin(context.userId);
  return RevenueService.consolidateCommission(params);
});
