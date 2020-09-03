// Leave this imported here for autoforms to work
import 'uniforms-bridge-simple-schema-2';

import { Meteor } from 'meteor/meteor';

import SimpleSchema from 'simpl-schema';

import { formatMessage } from '../utils/intl';

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAutoValue',
  'ignoreParentInLabel',
]);

SimpleSchema.prototype.label = function (key) {
  // Get all labels
  if (key === null || key === undefined) {
    const result = {};
    this._schemaKeys.forEach(schemaKey => {
      result[schemaKey] = this.label(schemaKey);
    });
    return result;
  }

  if (key.includes('.')) {
    // Remove nesting from keys
    const firstLevelKeys = this._firstLevelSchemaKeys;
    const parts = key.split('.');
    const partsWithoutIndex = parts.filter(subKey => subKey.length !== 1);
    const [firstPart] = partsWithoutIndex;

    if (firstLevelKeys.includes(firstPart)) {
      const parentKey = this.getDefinition(firstPart);
      if (parentKey.ignoreParentInLabel) {
        return formatMessage({
          id: `Forms.${partsWithoutIndex.slice(1).join('.')}`,
        });
      }
    }

    return formatMessage({ id: `Forms.${partsWithoutIndex.join('.')}` });
  }

  return formatMessage({ id: `Forms.${key}` });
};

Meteor.isStaging = Meteor.settings.public.environment === 'staging';
Meteor.isDevEnvironment =
  Meteor.settings.public.environment === 'dev-production';
