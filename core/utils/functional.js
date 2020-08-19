export const not = func => args => !func(args);
export const and = (...funcs) => (...args) =>
  funcs.every(func => func(...args));
export const or = (...funcs) => (...args) => funcs.some(func => func(...args));
