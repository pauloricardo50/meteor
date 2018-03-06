import { Bert } from 'meteor/themeteorchef:bert';

const bert = (title, message, type = 'success') => {
  Bert.defaults.hideDelay = 7500;
  Bert.alert({
    title,
    message: `<h3 class="bert">${message}</h3>`,
    type,
    style: 'fixed-top',
  });
};

export default bert;
