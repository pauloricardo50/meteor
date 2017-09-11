export const getRange = (offers, key) =>
  offers.reduce(
    (accumulator, offer) => {
      const standard = offer.standardOffer[key];
      const counterpart = offer.counterpartOffer && offer.counterpartOffer[key];

      if (standard < accumulator.min) {
        accumulator.min = standard;
      }
      if (standard > accumulator.max) {
        accumulator.max = standard;
      }
      if (counterpart) {
        if (counterpart < accumulator.min) {
          accumulator.min = counterpart;
        }
        if (counterpart > accumulator.max) {
          accumulator.max = counterpart;
        }
      }

      return accumulator;
    },
    { min: Infinity, max: 0 },
  );

export const extractOffers = (offers, loanRequest) => {
  const array = [];
  offers.forEach((offer) => {
    const meta = {
      organization: offer.organization,
      canton: offer.canton,
      id: offer._id,
    };

    array.push({
      ...offer.standardOffer,
      ...meta,
      conditions: offer.conditions,
      uid: `standard${offer._id}`,
      type: 'standard',
    });

    if (offer.counterpartOffer) {
      array.push({
        ...offer.counterpartOffer,
        ...meta,
        conditions: offer.conditions,
        counterparts: offer.counterparts,
        uid: `counterparts${offer._id}`,
        type: 'counterparts',
      });
    }
  });
  return array;
};
