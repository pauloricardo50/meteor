import { simpleUserFragment } from './userFragments';
import fullUserFragment from './fullUserFragment';

export default {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};
