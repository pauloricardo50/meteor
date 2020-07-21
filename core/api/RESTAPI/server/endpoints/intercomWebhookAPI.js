import IntercomService from '../../../intercom/server/IntercomService';

const intercomWebhookAPI = ({ body }) => {
  try {
    IntercomService.handleWebhook({ body });
    return {};
  } catch (error) {
    return {
      status: error.error,
      message: error.message,
      errorName: error.reason,
    };
  }
};

export default intercomWebhookAPI;
