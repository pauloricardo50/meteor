// @flow
import SimpleSchema from 'simpl-schema';
import { PURCHASE_TYPE, OWNER, CANTONS, RESIDENCE_TYPE } from '../../constants';

const GeneralSchema = new SimpleSchema({
  purchaseType: {
    type: String,
    defaultValue: PURCHASE_TYPE.ACQUISITION,
    allowedValues: Object.values(PURCHASE_TYPE),
  },
  residenceType: {
    type: String,
    defaultValue: RESIDENCE_TYPE.MAIN_RESIDENCE,
    allowedValues: Object.values(RESIDENCE_TYPE),
  },
  canton: {
    type: String,
    optional: true,
    allowedValues: Object.keys(CANTONS),
  },
  currentOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  futureOwner: {
    type: String,
    defaultValue: OWNER.FIRST,
    allowedValues: Object.values(OWNER),
  },
  otherOwner: {
    type: String,
    optional: true,
  },
});

export default GeneralSchema;
