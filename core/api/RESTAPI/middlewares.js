import bodyParser from 'body-parser';
import { REST_API_ERRORS, sendError } from './errors';

export const bodyParserJSON = bodyParser.json();
export const bodyParserUrlEncoded = bodyParser.urlencoded({ extended: false });

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

export const filter = (req, res, next) => {
  const {
    headers: { authorization, 'content-type': contentType },
  } = req;
  if (!contentType || contentType !== 'application/json') {
    sendError({ res, error: REST_API_ERRORS.WRONG_CONTENT_TYPE });
  }

  const token = getToken(authorization);

  if (!token) {
    sendError({ res, error: REST_API_ERRORS.WRONG_AUTHORIZATION_TYPE });
  }

  req.token = token;

  next();
};

export const authenticate = (req, res, next) => {
  const { token } = req;

  // get user from token HERE
  const user = token === '12345' && { _id: '1234' };

  if (!user) {
    sendError({ res, error: REST_API_ERRORS.AUTHORIZATION_FAILED });
  }

  req.user = user;

  next();
};
