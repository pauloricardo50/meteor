import { getOpenGraphMeta } from '../../../utils/openGraph';
import { createMeteorAsyncFunction } from '../../helpers';
import assigneeReducer from '../../reducers/assigneeReducer';
import Properties from '../properties';

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
