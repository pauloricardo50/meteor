const promotionSchema = {
  promotionLinks: { type: Array, defaultValue: [] },
  'promotionLinks.$': Object,
  'promotionLinks.$._id': { type: String, optional: true },
  'promotionLinks.$.priorityOrder': {
    type: Array,
    defaultValue: [],
  },
  'promotionLinks.$.priorityOrder.$': String,
  'promotionLinks.$.invitedBy': { type: String, optional: true },
  'promotionLinks.$.showAllLots': {
    type: Boolean,
    optional: true,
    defaultValue: true,
  },
  promotionOptionLinks: { type: Array, defaultValue: [] },
  'promotionOptionLinks.$': Object,
  'promotionOptionLinks.$._id': { type: String, optional: true },
};

export default promotionSchema;
