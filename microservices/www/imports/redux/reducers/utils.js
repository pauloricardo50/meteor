export const createValueReducer = (storeName, initialState = null) => (
  state = initialState,
  { type, value },
) => {
  switch (type) {
  case `${storeName}.SET`:
    return value;
  case `${storeName}.RESET`:
    return initialState;
  default:
    return state;
  }
};
