import { Meteor } from 'meteor/meteor';
import * as _constants from './constants';

export { default as Loans } from './loans';
export { default as Borrowers } from './borrowers';
export { default as Offers } from './offers';
export { default as Properties } from './properties';
export { default as Users } from './users';
export { default as Tasks } from './tasks';

export { default as SecurityService } from './security';
export { default as EventService } from './events';
export * from './methods';
export * from './helpers';
export * from './containerToolkit';

// Do this for autocompletion...
export const constants = _constants;

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
