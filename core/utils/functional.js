export const not = func => args => !func(args);
export const and = (func1, func2) => args => func1(args) && func2(args);
export const or = (func1, func2) => args => func1(args) || func2(args);
