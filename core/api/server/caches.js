import { migrate } from 'meteor/herteby:denormalize';

migrate('loans', 'userCache', { userCache: { $exists: false } });
migrate('offers', 'lenderCache', { lenderCache: { $exists: false } });
migrate('lenderRules', 'organisationCache', {
  organisationCache: { $exists: false },
});
