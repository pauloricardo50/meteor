import areInputsEqual from './areInputsEqual';

// <ResultFn: (...any[]) => mixed>
// The purpose of this typing is to ensure that the returned memoized
// function has the same type as the provided function (`resultFn`).
// ResultFn:        Generic type (which is the same as the resultFn).
// (...any[]): Accepts any length of arguments - and they are not checked
// mixed:           The result can be anything but needs to be checked before usage
const memoizeOne = function(resultFn, isEqual = areInputsEqual) {
  let lastThis;
  let lastArgs = [];
  let lastResult;
  let calledOnce = false;

  // breaking cache when context (this) or arguments change
  const result = function(...newArgs) {
    if (calledOnce && lastThis === this && isEqual(newArgs, lastArgs)) {
      return lastResult;
    }

    // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
    // Doing the lastResult assignment first so that if it throws
    // nothing will be overwritten
    lastResult = resultFn.apply(this, newArgs);
    calledOnce = true;
    lastThis = this;
    lastArgs = newArgs;
    return lastResult;
  };

  return result;
};

export default memoizeOne;
