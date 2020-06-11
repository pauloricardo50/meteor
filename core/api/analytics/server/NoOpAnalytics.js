import MiddlewareManager from '../../../utils/MiddlewareManager';

export default class {
  constructor() {
    this.middlewareManager = new MiddlewareManager(this);
  }

  identify() {}

  page() {}

  track() {}

  alias() {}

  flush() {}
}
