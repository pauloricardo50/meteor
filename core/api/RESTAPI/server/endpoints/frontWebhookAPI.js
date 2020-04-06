import { FrontService } from '../../../front/server/FrontService';

const frontWebhookAPI = ({ body, params = {} }) => {
  try {
    const { webhookName } = params;
    FrontService.handleWebhook({ webhookName, body });
    return {};
  } catch (error) {
    return {
      status: error.error,
      message: error.message,
      errorName: error.reason,
    };
  }
};

export default frontWebhookAPI;
