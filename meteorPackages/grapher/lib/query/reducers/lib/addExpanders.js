/**
 * @param {[niceField: string]: bodyToExpandTo} map
 */
export default function addExpanders(map) {
  const collection = this;
  const reducers = {};
  for (const key in map) {
    reducers[key] = {
      body: map[key],
      expand: true,
    };
  }

  collection.addReducers(reducers);
}
