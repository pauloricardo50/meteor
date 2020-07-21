import DripService from '../../../drip/server/DripService';

const dripWebhookAPI = ({ body }) => {
  try {
    DripService.handleWebhook({ body });
    return {};
  } catch (error) {
    return {
      status: error.error,
      message: error.message,
      errorName: error.reason,
    };
  }
};

export default dripWebhookAPI;
