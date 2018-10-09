const promotionSchema = {
  promotionLinks: { type: Array, optional: true },
  'promotionLinks.$': Object,
  'promotionLinks.$._id': String,
  'promotionLinks.$.priorityOrder': { type: Array, optional: true },
  'promotionLinks.$.priorityOrder.$': String,
  promotionOptionLinks: { type: Array, optional: true },
  'promotionOptionLinks.$': Object,
  'promotionOptionLinks.$._id': String,
};

export default promotionSchema;
