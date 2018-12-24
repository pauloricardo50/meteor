import fullUserFragment from './fullUserFragment';
import { simpleUserFragment } from './userFragments';

export default {
  ...fullUserFragment,
  assignedEmployee: simpleUserFragment,
};
