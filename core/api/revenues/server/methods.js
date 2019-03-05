import SecurityService from '../../security';
import RevenueService from './RevenueService';
import { revenueInsert, revenueRemove, revenueUpdate } from '../methodDefinitions';

revenueInsert.setHandler((context, { revenue }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  RevenueService.insert(revenue));

revenueRemove.setHandler((context, { revenueId }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  RevenueService.remove(revenueId));

revenueUpdate.setHandler((context, { revenueId, object }) =>
// Add security checks
// Example
// SecurityService.checkCurrentUserIsAdmin();
  RevenueService._update({ id: revenueId, object }));
