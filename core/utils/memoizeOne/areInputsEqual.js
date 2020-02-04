//      

const inputHasChanged = (next, prev) =>
  next.some((newInput, index) => newInput !== prev[index]);

export default function areInputsEqual(
  newInputs         ,
  lastInputs         ,
) {
  // no checks needed if the inputs length has changed
  if (newInputs.length !== lastInputs.length) {
    return false;
  }

  // Handle memoization for functions with 1 argument which is an object
  if (
    newInputs.length === 1 &&
    typeof newInputs[0] === 'object' &&
    typeof lastInputs[0] === 'object' &&
    newInputs[0] !== null &&
    lastInputs[0] !== null
  ) {
    const newArgs = Object.values(newInputs[0]);
    const lastArgs = Object.values(lastInputs[0]);

    if (newArgs.length !== lastArgs.length) {
      return false;
    }

    const oneInputHasChanged = inputHasChanged(newArgs, lastArgs);
    return !oneInputHasChanged;
  }

  const oneInputHasChanged = inputHasChanged(newInputs, lastInputs);
  return !oneInputHasChanged;
}
