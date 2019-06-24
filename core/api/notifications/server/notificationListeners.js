import ServerEventService from '../../events/server/ServerEventService';
import { taskComplete } from '../../tasks/methodDefinitions';
import NotificationService from './NotificationService';

ServerEventService.addMethodListener(taskComplete, ({ params: { taskId } }) => {
  NotificationService.readTaskNotification({ taskId });
});
