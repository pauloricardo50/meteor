import * as cantonConfigs from './cantonConfigs';

class NotaryFeesCalculator {
  constructor({ canton }) {
    this.init(canton);
  }

  init(canton) {
    const config = cantonConfigs[canton];
    Object.assign(this, config);
  }

  getNotaryFeesForLoan(loan) {
    // TODO
    return 0;
  }
}

export default NotaryFeesCalculator;
