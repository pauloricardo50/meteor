import * as cantonConfigs from './cantonConfigs';

class NotaryFeesCalculator {
  constructor({ canton }) {
    this.init(canton);
  }

  init(canton) {
    const config = cantonConfigs[canton];
    Object.assign(this, config);
  }
}

export default NotaryFeesCalculator;
