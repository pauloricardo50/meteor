import { Mutation } from 'meteor/cultofcoders:mutations';
import { setMethodLimiter } from '../../utils/rate-limit';

export class Method extends Mutation {
  setHandler(fn) {
    super.setHandler(fn);
    // FIXME: Extremely slow, slows down everything
    // setMethodLimiter(this.config);
  }
}
