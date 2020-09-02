import MiddlewareManager from '../../../utils/MiddlewareManager';

export default class {
  constructor() {
    this.middlewareManager = new MiddlewareManager(this);
  }

  identify() {}

  page() {}

  track(...args) {
    console.log(...args);
  }

  alias() {}

  flush() {}
}
