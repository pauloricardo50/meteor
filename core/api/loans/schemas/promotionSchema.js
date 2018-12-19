const promotionSchema = {
  promotionLinks: { type: Array, defaultValue: [] },
  'promotionLinks.$': Object,
  'promotionLinks.$._id': { type: String, optional: true },
  'promotionLinks.$.priorityOrder': {
    type: Array,
    defaultValue: [],
  },
  'promotionLinks.$.priorityOrder.$': String,
  promotionOptionLinks: { type: Array, defaultValue: [] },
  'promotionOptionLinks.$': Object,
  'promotionOptionLinks.$._id': { type: String, optional: true },
};

export default promotionSchema;
