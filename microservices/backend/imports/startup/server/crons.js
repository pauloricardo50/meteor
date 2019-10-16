import CronService from 'core/api/cron/server/CronService';
import Irs10yService from 'core/api/irs10y/server/Irs10yService';
import LoanService from 'core/api/loans/server/LoanService';
import NotificationService from 'core/api/notifications/server/NotificationService';
import UpdateWatcherService from 'core/api/updateWatchers/server/UpdateWatcherService';
import SessionService from 'core/api/sessions/server/SessionService';
import FileService from 'core/api/files/server/FileService';
import PromotionReservationService from 'core/api/promotionReservations/server/PromotionReservationService';

CronService.init();

CronService.addCron(
  {
    name: 'Fetch IRS 10Y',
    frequency: 'at 6:30am every day',
    func: () => Irs10yService.fetchIrs(),
  },
  { cronitorId: '19MCrQ' },
);

CronService.addCron(
  {
    name: 'Expire anonymous loans',
    frequency: 'at 00:00',
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
    name: 'Expire promotion reservations',
    frequency: 'every day',
    func: () => PromotionReservationService.expirePromotionReservations(),
  },
  { cronitorId: 'cLKGgS' },
);

CronService.addCron(
  {
    name: 'Generate tasks for promotion reservations expiring soon',
    frequency: 'every weekday',
    func: () => PromotionReservationService.generateExpiringTomorrowTasks(),
  },
  { cronitorId: 'N77C0a' },
);
