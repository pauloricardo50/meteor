const SimpleSchema = require('simpl-schema').default;
SimpleSchema.extendOptions([
  'index',
  'unique',
  'denyInsert',
  'denyUpdate',
  'uniforms',
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);