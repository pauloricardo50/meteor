import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  additionalDocuments,
  mortgageNoteLinks,
} from '../../helpers/sharedSchemas';
import { initialDocuments } from '../borrowersAdditionalDocuments';
import {
  personalInfoSchema,
  financeInfoSchema,
  ownCompaniesSchema,
} from './otherSchemas';

// Documentation is in the google drive dev/MongoDB Schemas
const BorrowerSchema = new SimpleSchema({
  userId: {
    type: String,
    optional: true,
  },
  createdAt,
  updatedAt,
  admin: {
    // TODO
    type: Object,
    optional: true,
  },
  adminValidation: {
    type: Object,
    defaultValue: {},
    blackbox: true,
  },
  ...personalInfoSchema,
  ...financeInfoSchema,
  ...additionalDocuments(initialDocuments),
  ...mortgageNoteLinks,
  ...ownCompaniesSchema,
});

const protectedKeys = [
  '_id',
  'additionalDocuments',
  'admin',
  'adminValidation',
  'createdAt',
  'logic',
  'mortgageNoteLinks',
  'updatedAt',
  'userId',
];

export const BorrowerSchemaAdmin = BorrowerSchema.omit(...protectedKeys);
export default BorrowerSchema;
