import { WebApp } from 'meteor/webapp';
import {
  bodyParserJSON,
  bodyParserUrlEncoded,
  filter,
  authenticate,
} from './middlewares';

export default class RESTAPI {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.middlewares = [
      filter,
      bodyParserJSON,
      bodyParserUrlEncoded,
      authenticate,
    ];
    this.middlewares.forEach(middleware =>
      this.connectHandlers({ handler: middleware }));
  }

  connectHandlers({ path, handler }) {
    WebApp.connectHandlers.use(path || this.rootPath, handler);
  }
}
