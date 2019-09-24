import MiddlewareManager from '../../../utils/MiddlewareManager';
import { impersonateMiddleware } from './analyticsHelpers';

export default class {
  constructor() {
    this.middlewareManager = new MiddlewareManager(this);
  }

  identify() {}

  page() {}

  track() {}

  alias() {}

  initAnalytics(context) {
    ['identify', 'track', 'page', 'alias'].forEach((method) => {
      this.middlewareManager.applyToMethod(
        method,
        impersonateMiddleware(context),
      );
    });
  }

  flush() {}
}
