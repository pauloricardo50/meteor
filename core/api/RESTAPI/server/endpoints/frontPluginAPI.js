import FrontService from '../../../front/server/FrontService';
import UserService from '../../../users/server/UserService';
import { setAPIUser } from '../helpers';

const frontPluginAPI = async ({ req, body }) => {
  try {
    const result = await FrontService.handleRequest(body);
    if (!result || typeof result !== 'object') {
      return { result };
    }
    const { email } = body;

    const user = UserService.get({ 'emails.0.address': email }, { _id: 1 });
    req.user = user;
    setAPIUser(user);

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
