import DripService from '../../../drip/server/DripService';

const dripWebhookAPI = async ({ body }) => {
  try {
    await DripService.handleWebhook({ body });
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
