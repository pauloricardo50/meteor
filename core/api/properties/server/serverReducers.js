import Properties from '../properties';
import assigneeReducer from '../../reducers/assigneeReducer';
import { createMeteorAsyncFunction } from '../../helpers';
import { getOpenGraphMeta } from '../../../utils/openGraph';

Properties.addReducers({
  ...assigneeReducer(),
  openGraphData: {
    body: { useOpenGraph: 1, externalUrl: 1 },
    reduce: ({ useOpenGraph, externalUrl }) => {
      const asyncFunc = createMeteorAsyncFunction(getOpenGraphMeta);

      if (useOpenGraph) {
        return asyncFunc(externalUrl);
      }

      return undefined;
    },
  },
});
