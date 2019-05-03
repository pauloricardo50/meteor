import { shouldUpdate } from 'recompose';
import { arePathsUnequal } from '../utils/reactFunctions';

// Given an array of prop paths, only rerender the component
// when they change
export default paths => shouldUpdate(arePathsUnequal(paths));
