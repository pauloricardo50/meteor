import SimpleSchema from 'simpl-schema';

const PromotionOptionSchema = new SimpleSchema({
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
});

export default PromotionOptionSchema;
