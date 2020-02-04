import FrontService from '../../../front/server/FrontService';

const frontAPI = ({ body }) => {
  const result = FrontService.handleRequest(body);

  if (!result) {
    return {};
  }

  return result;
};

export default frontAPI;
