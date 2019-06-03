import { Method } from '../../methods/methods';

export const testCollectionInsert = new Method({
  name: 'testCollectionInsert',
  params: {
    value: Number,
    name: String,
  },
});
