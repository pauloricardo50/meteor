import CronService from 'core/api/cron/server/CronService';
import Irs10yService from 'core/api/irs10y/server/Irs10yService';
import LoanService from 'core/api/loans/server/LoanService';
import NotificationService from 'core/api/notifications/server/NotificationService';
import UpdateWatcherService from 'core/api/updateWatchers/server/UpdateWatcherService';
import SessionService from 'core/api/sessions/server/SessionService';
import FileService from 'core/api/files/server/FileService';
import PromotionOptionService from 'core/api/promotionOptions/server/PromotionOptionService';

import {
  generateExpiringSoonReservationTasks,
  generateTenDayExpirationReminderTasks,
} from 'core/api/promotionOptions/server/methods';

CronService.init();

CronService.addCron(
  {
    name: 'Fetch IRS 10Y',
    frequency: 'at 6:30',
    func: () => Irs10yService.fetchIrs(),
  },
  { cronitorId: '19MCrQ' },
);

CronService.addCron(
  {
    name: 'Expire anonymous loans',
    frequency: 'at 0:00',
    func: () => LoanService.expireAnonymousLoans(),
  },
  { cronitorId: 'Ti1GXW' },
);

CronService.addCron(
  {
    name: 'Generate notifications',
    frequency: 'every 1 minute',
    func: () => {
      NotificationService.addTaskNotifications();
      NotificationService.addActivityNotifications();
      NotificationService.addRevenueNotifications();
    },
  },
  { cronitorId: 'GXHpfD' },
);

CronService.addCron(
  {
    name: 'Manage update watchers',
    frequency: 'every 1 minute',
    func: () =>
      UpdateWatcherService.manageUpdateWatchers({ secondsFromNow: 120 }),
  },
  { cronitorId: 'hvqGtz' },
);

CronService.addCron(
  {
    name: 'Remove old sessions',
    frequency: 'every 1 minute',
    func: () => SessionService.removeOldSessions(),
  },
  { cronitorId: 'nECCcy' },
);

CronService.addCron(
  {
    name: 'Flush temp files',
    frequency: 'every 1 minute',
    func: () => FileService.flushTempFiles(),
  },
  { cronitorId: 'RntC9I' },
);

CronService.addCron(
  {
    name: 'Generate tasks for promotion reservations expiring in 10 days',
    frequency: 'every 1 day',
    func: () =>
      generateTenDayExpirationReminderTasks
        .run({})
        .then((promotionOptions = []) => promotionOptions.length),
  },
  { cronitorId: 'KbK0Gy' },
);

CronService.addCron(
  {
    name:
      'Generate tasks for promotion reservations expiring the following business day',
    frequency: 'every weekday',
    func: () =>
      generateExpiringSoonReservationTasks
        .run({})
        .then((promotionOptions = []) => promotionOptions.length),
  },
  { cronitorId: 'N77C0a' },
);

CronService.addCron(
  {
    name: 'Expire promotion reservations',
    frequency: 'every 1 day',
    func: () =>
      PromotionOptionService.expireReservations().then(
        toExpire => toExpire.length,
      ),
  },
  { cronitorId: 'cLKGgS' },
);
