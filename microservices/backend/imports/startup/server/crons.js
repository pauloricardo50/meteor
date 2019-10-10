import CronService from 'core/api/cron/server/CronService';
import Irs10yService from 'core/api/irs10y/server/Irs10yService';
import LoanService from 'core/api/loans/server/LoanService';
import NotificationService from 'core/api/notifications/server/NotificationService';
import UpdateWatcherService from 'core/api/updateWatchers/server/UpdateWatcherService';
import SessionService from 'core/api/sessions/server/SessionService';

CronService.init();

CronService.addJob(
  {
    name: 'Fetch IRS 10Y',
    schedule(parser) {
      return parser.text('at 6:30am every day');
    },
    func: () => Irs10yService.fetchIrs(),
  },
  { id: '19MCrQ' },
);

CronService.addJob(
  {
    name: 'Expire anonymous loans',
    schedule(parser) {
      return parser.text('every day');
    },
    func: () => LoanService.expireAnonymousLoans(),
  },
  { id: 'Ti1GXW' },
);

CronService.addJob(
  {
    name: 'Generate notifications',
    schedule(parser) {
      return parser.text('every 1 minute');
    },
    func: () => {
      NotificationService.addTaskNotifications();
      NotificationService.addActivityNotifications();
      NotificationService.addRevenueNotifications();
    },
  },
  { id: 'GXHpfD' },
);

CronService.addJob(
  {
    name: 'Manage update watchers',
    schedule(parser) {
      return parser.text('every 1 minute');
    },
    func: () =>
      UpdateWatcherService.manageUpdateWatchers({ secondsFromNow: 120 }),
  },
  { id: 'hvqGtz' },
);

CronService.addJob(
  {
    name: 'Remove old sessions',
    schedule(parser) {
      return parser.text('every 1 minute');
    },
    func: () => SessionService.removeOldSessions(),
  },
  { id: 'nECCcy' },
);
