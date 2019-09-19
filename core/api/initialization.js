// Leave this imported here for autoforms to work
import 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { editStringPrototype } from '../utils/stringMethods';

SimpleSchema.extendOptions([
  'condition',
  'customAllowedValues',
  'customAutoValue',
]);

editStringPrototype();
