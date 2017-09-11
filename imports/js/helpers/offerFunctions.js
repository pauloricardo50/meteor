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
