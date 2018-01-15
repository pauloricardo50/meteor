// Create a store holding a collecion
export const createCollectionReducers = collectionNames =>
  collectionNames.reduce(
    (acc, collectionName) => ({
      ...acc,
      [collectionName]: (state = [], action) => {
        switch (action.type) {
          case `${collectionName}.ADD`:
            return [...state, action.value];
          case `${collectionName}.CHANGE`: {
            const idx = state.findIndex(item => item.id === action.value.id);
            const newItem = { ...state[idx], ...action.value.fields };
            return [...state.slice(0, idx), newItem, ...state.slice(idx + 1)];
          }
          case `${collectionName}.REMOVE`: {
            const idx = state.findIndex(item => item.id === action.value.id);
            return [...state.slice(0, idx), ...state.slice(idx + 1)];
          }
          default:
            return state;
        }
      },
    }),
    {},
  );
