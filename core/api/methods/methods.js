import { Meteor } from 'meteor/meteor';
import { Mutation } from 'meteor/cultofcoders:mutations';

// import { setMethodLimiter } from '../../utils/rate-limit';

if (Meteor.isTest) {
  Mutation.isDebugEnabled = false;
} else {
  Mutation.isDebugEnabled = { omit: ['analyticsPage', 'analyticsLogin'] };
}

export class Method extends Mutation {
  setHandler(fn) {
    super.setHandler(fn);
    // FIXME: Extremely slow, slows down everything
    // setMethodLimiter(this.config);
  }
}
