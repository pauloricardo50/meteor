import RESTAPI from './RESTAPI';

const startAPI = () => {
  const api = new RESTAPI('/api');
  api.connectHandlers({
    path: '/api/test',
    handler: (req, res, next) => res.end('hello'),
  });
};

export default startAPI;
