import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { PROMOTION_OPTION_SOLVENCY } from '../promotionOptionConstants';

const PromotionOptionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': String,
  lotLinks: { type: Array, optional: true },
  'lotLinks.$': Object,
  'lotLinks.$._id': String,
  custom: {
    type: String,
    optional: true,
  },
  solvency: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_SOLVENCY),
  },
});

export default PromotionOptionSchema;
