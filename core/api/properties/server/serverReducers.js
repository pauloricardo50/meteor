import Properties from '../properties';
import assigneeReducer from '../../reducers/assigneeReducer';
import { createMeteorAsyncFunction } from '../../helpers';
import { getOpenGraphMeta } from '../../../utils/openGraph';

Properties.addReducers({
  ...assigneeReducer(),
  openGraphData: {
    body: { externalUrl: 1 },
    reduce: ({ externalUrl }) => {
      const asyncFunc = createMeteorAsyncFunction(getOpenGraphMeta);

      if (externalUrl) {
        return asyncFunc(externalUrl);
      }

      return undefined;
    },
  },
});
