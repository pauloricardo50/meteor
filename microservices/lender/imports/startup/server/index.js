import { Meteor } from 'meteor/meteor';

import 'core/api/api';
import 'core/api/api-server';
import '../accounts-config';

Meteor.startup(() => {});

console.log('Hello World lender server');
