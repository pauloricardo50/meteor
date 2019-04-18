// Leave this imported here for autoforms to work
import 'uniforms/SimpleSchema2Bridge';
import SimpleSchema from 'simpl-schema';

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);
