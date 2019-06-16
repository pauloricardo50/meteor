// Inversed links need to be defined after direct links, use this
// class to manage that
// Might become obsolete after this is fixed in grapher
// https://github.com/cult-of-coders/grapher/issues/200#issuecomment-500803766
class LinkInitializer {
  constructor() {
    this.direct = [];
    this.inversed = [];
  }

  directInit(fn) {
    this.direct.push(fn);
  }

  inversedInit(fn) {
    this.inversed.push(fn);
  }

  setLinks() {
    this.direct.forEach(fn => fn());
    this.inversed.forEach(fn => fn());
    // Don't unnecessarily store these functions
    delete this.direct;
    delete this.inversed;
  }
}

export default new LinkInitializer();
