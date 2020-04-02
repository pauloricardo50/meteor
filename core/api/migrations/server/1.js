import { Migrations } from 'meteor/percolate:migrations';

import Properties from '../../properties/index';
import { PROPERTY_CATEGORY } from '../../properties/propertyConstants';

export const up = () => {
  Properties.update(
    {},
    { $set: { category: PROPERTY_CATEGORY.USER } },
    { multi: true },
  );
};

export const down = () => {
  Properties.update({}, { $unset: { category: true } }, { multi: true });
};

Migrations.add({
  version: 1,
  name: 'Add property category',
  up,
  down,
});
