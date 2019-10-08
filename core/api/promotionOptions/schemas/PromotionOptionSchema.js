import SimpleSchema from 'simpl-schema';
import { createdAt, updatedAt } from '../../helpers/sharedSchemas';
import { PROMOTION_OPTION_SOLVENCY } from '../promotionOptionConstants';

const PromotionOptionSchema = new SimpleSchema({
  createdAt,
  updatedAt,
  promotionLotLinks: { type: Array, defaultValue: [] },
  'promotionLotLinks.$': Object,
  'promotionLotLinks.$._id': { type: String, optional: true },
  lotLinks: { type: Array, optional: true },
  'lotLinks.$': Object,
  'lotLinks.$._id': { type: String, optional: true },
  custom: {
    type: String,
    optional: true,
  },
  solvency: {
    type: String,
    allowedValues: Object.values(PROMOTION_OPTION_SOLVENCY),
    defaultValue: PROMOTION_OPTION_SOLVENCY.UNDETERMINED,
    uniforms: { displayEmpty: false },
  },
  proNote: { type: String, optional: true },
});

export default PromotionOptionSchema;
