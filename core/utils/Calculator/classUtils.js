export const withConfig = extraConfig => SuperClass =>
  class extends SuperClass {
    constructor(config) {
      super({ ...config, ...extraConfig });
    }
  };
