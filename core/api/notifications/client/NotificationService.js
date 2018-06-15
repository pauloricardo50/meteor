import { Bert } from 'meteor/themeteorchef:bert';
import SecurityService from '../../security';

class NotificationService {
  notifyAdmin = (params) => {
    if (SecurityService.currentUserIsAdmin()) {
      this.alert(params);
    }
  };

  alert = ({ title, message }) => {
    Bert.alert({
      title,
      message,
      type: 'success',
      style: 'fixed-top',
    });
  };
}

export default new NotificationService();
