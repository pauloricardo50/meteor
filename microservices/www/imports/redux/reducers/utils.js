export const createValueReducer = (storeName, initialState = null) => (
  state = initialState,
  { type, value } = {},
) => {
  switch (type) {
  case `${storeName}_SET`:
    return value;
  case `${storeName}_RESET`:
    return initialState;
  default:
    return state;
  }
};
