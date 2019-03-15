import { migrate } from 'meteor/herteby:denormalize';

migrate('loans', 'userCache', { userCache: { $exists: false } });
