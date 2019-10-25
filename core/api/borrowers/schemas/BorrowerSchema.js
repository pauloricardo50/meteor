import SimpleSchema from 'simpl-schema';
import {
  createdAt,
  updatedAt,
  additionalDocuments,
  mortgageNoteLinks,
  documentsField,
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
  documents: documentsField,
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
  'createdAt',
  'logic',
  'mortgageNoteLinks',
  'updatedAt',
  'userId',
  'documents',
];

export const BorrowerSchemaAdmin = BorrowerSchema.omit(...protectedKeys);
export default BorrowerSchema;
