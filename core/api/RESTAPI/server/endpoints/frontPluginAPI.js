import FrontService from '../../../front/server/FrontService';

const frontPluginAPI = async ({ body, user }) => {
  try {
    const result = await FrontService.handleRequest({ user, body });

    if (!result || typeof result !== 'object') {
      return { result };
    }

    return result;
  } catch (error) {
    return {
      status: error.error,
      message: error.message,
      errorName: error.reason,
    };
  }
};

export default frontPluginAPI;
