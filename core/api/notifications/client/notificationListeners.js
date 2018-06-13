import { notifyAdmin } from '../methodDefinitions';
import ClientEventService from '../../events/ClientEventService';
import NotificationService from './NotificationService';

export const notifyAdminListener = ({ title, message }) => {
  NotificationService.alert({ title, message });
};
ClientEventService.addMethodListener(notifyAdmin, notifyAdminListener);
