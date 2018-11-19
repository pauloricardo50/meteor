import RESTAPI from './RESTAPI';
import { HTTP_STATUS_CODES } from './constants';

const startAPI = () => {
  const api = new RESTAPI('/api');
  api.connectHandlers({
    path: '/api/hello',
    handler: (req, res, next) =>
      api.sendResponse({
        res,
        data: {
          statusCode: HTTP_STATUS_CODES.OK,
          body: {
            message: 'Hello',
          },
        },
      }),
  });
  return api;
};

export default startAPI;
