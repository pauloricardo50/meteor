import { getOpenGraphMeta } from '../../../utils/openGraph';
import { createMeteorAsyncFunction } from '../../helpers';
import assigneeReducer from '../../reducers/assigneeReducer';
import Properties from '../properties';

Properties.addReducers({
  ...assigneeReducer(),
  openGraphData: {
    body: { externalUrl: 1 },
    reduce: ({ externalUrl }) => {
      if (externalUrl) {
        const asyncFunc = createMeteorAsyncFunction(getOpenGraphMeta);
        const externalStuff = asyncFunc(externalUrl);
        return externalStuff;
      }
    },
  },
});
