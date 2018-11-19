import bodyParser from 'body-parser';
import { REST_API_ERRORS } from './constants';
import { sendResponse } from './RESTAPI';
import { Services } from '../../api-server';
import { USERS_COLLECTION } from '../../users/userConstants';

export const bodyParserJSON = () => bodyParser.json();
export const bodyParserUrlEncoded = () =>
  bodyParser.urlencoded({ extended: false });

export const getToken = (authorization) => {
  if (!authorization) {
    return undefined;
  }

  const auth = authorization.split(' ');

  if (auth.length !== 2 || !auth.includes('Bearer')) {
    return undefined;
  }

  const token = auth[1];

  return token;
};

export const filter = api => (req, res, next) => {
  const endpoint = {
    path: api.getRequestPath(req),
    method: api.getRequestMethod(req),
  };
  const {
    headers: { authorization, 'content-type': contentType },
  } = req;

  if (!api.endpointExists(endpoint)) {
    return sendResponse({
      res,
      data: REST_API_ERRORS.UNKNOWN_ENDPOINT(endpoint),
    });
  }

  if (!contentType || contentType !== 'application/json') {
    return sendResponse({
      res,
      data: REST_API_ERRORS.WRONG_CONTENT_TYPE(contentType),
    });
  }

  const token = getToken(authorization);

  if (!token) {
    return sendResponse({
      res,
      data: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE,
    });
  }

  req.token = token;

  next();
};

export const authenticate = () => (req, res, next) => {
  const { token } = req;
  const user = Services[USERS_COLLECTION].findOne({ apiToken: token });

  if (!user) {
    return sendResponse({ res, data: REST_API_ERRORS.AUTHORIZATION_FAILED });
  }

  req.user = user;

  next();
};
