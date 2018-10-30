export class Mutation {
  constructor(config) {
    this.config = config;

    // Do this to allow stubbing of run
    this.run = () => Promise.resolve();
  }
}
