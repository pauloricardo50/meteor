const promotionSchema = {
  promotionLinks: { type: Array, defaultValue: [] },
  'promotionLinks.$': Object,
  'promotionLinks.$._id': String,
  'promotionLinks.$.priorityOrder': { type: Array, optional: true },
  'promotionLinks.$.priorityOrder.$': String,
  promotionOptionLinks: { type: Array, defaultValue: [] },
  'promotionOptionLinks.$': Object,
  'promotionOptionLinks.$._id': String,
};

export default promotionSchema;
