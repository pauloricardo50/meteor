import { Bert } from 'meteor/themeteorchef:bert';

class NotificationService {
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
