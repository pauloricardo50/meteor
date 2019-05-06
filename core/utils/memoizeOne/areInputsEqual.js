// @flow
export default function areInputsEqual(
  newInputs: mixed[],
  lastInputs: mixed[],
) {
  // no checks needed if the inputs length has changed
  if (newInputs.length !== lastInputs.length) {
    return false;
  }

  const oneInputHasChanged = newInputs.some((newInput, index) => newInput !== lastInputs[index]);
  return !oneInputHasChanged;
}
