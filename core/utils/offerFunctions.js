import { getMonthlyWithExtractedOffer } from './loanFunctions';
import { OFFER_TYPE, INTEREST_RATES } from '../api/constants';

export const getRange = ({ offers }, key) =>
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

export const extractOffers = ({ offers, loan, property }) => {
  const array = [];
  offers.forEach((offer) => {
    const meta = {
      organization: offer.organization,
      canton: offer.canton,
      id: offer._id,
      rating: 5,
    };

    array.push({
      ...offer.standardOffer,
      ...meta,
      conditions: offer.conditions,
      uid: `standard${offer._id}`,
      type: OFFER_TYPE.STANDARD,
    });
    array[array.length - 1].monthly = getMonthlyWithExtractedOffer({
      loan,
      property,
      offer: array[array.length - 1],
    });

    if (offer.counterpartOffer) {
      array.push({
        ...offer.counterpartOffer,
        ...meta,
        conditions: offer.conditions,
        counterparts: offer.counterparts,
        uid: `counterparts${offer._id}`,
        type: OFFER_TYPE.COUNTERPARTS,
      });
      array[array.length - 1].monthly = getMonthlyWithExtractedOffer({
        loan,
        property,
        offer: array[array.length - 1],
      });
    }
  });
  return array;
};

export const getBestRate = (
  { offers = [] },
  duration = INTEREST_RATES.YEARS_10,
) =>
  (offers.length
    ? Math.min(...offers.reduce((acc, offer) => {
      if (offer.standardOffer[duration]) {
        acc.push(offer.standardOffer[duration]);
      }
      if (offer.counterpartOffer && offer.counterpartOffer[duration]) {
        acc.push(offer.counterpartOffer[duration]);
      }
      return acc;
    }, []))
    : undefined);
