import moment from 'moment';

// Gives the end time of an auction, given the start time
export const getAuctionEndTime = (startTime) => {
  const time = moment(startTime);

  if (time.isoWeekday() === 6) {
    // On saturdays, go to Tuesday
    time.add(3, 'd');
  } else if (time.isoWeekday() === 7) {
    // On sundays, go to Tuesday
    time.add(2, 'd');
  } else if (time.hour() >= 0 && time.hour() < 7) {
    // If the start time is between midnight and 7:00,
    // set endtime to be tomorrow night
    time.add(1, 'd');
  } else {
    // Else, set endtime in 2 days from now
    time.add(2, 'd');
  }

  // Skip weekends
  if (time.isoWeekday() === 6 || time.isoWeekday() === 7) {
    // Saturday or Sunday
    time.add(2, 'd');
  }

  // Auctions always end at midnight
  time.hours(23);
  time.minutes(59);
  time.seconds(59);
  time.milliseconds(0);

  return time.toDate();
};

export const loanIsVerified = ({
  loan: {
    logic: {
      verification: { validated },
    },
  },
}) => validated !== undefined;

export const formatLoanWithStructure = (loan) => {
  const newLoan = { ...loan };
  if (loan.selectedStructure) {
    const structure = loan.structures.find(({ id }) => id === loan.selectedStructure);

    if (structure) {
      newLoan.structure = structure;

      if (structure.propertyId) {
        const property = loan.properties.find(({ _id }) => _id === structure.propertyId);
        newLoan.structure = { ...newLoan.structure, property };
      }

      if (structure.offerId) {
        const offer = loan.offers.find(({ _id }) => _id === structure.offerId);
        newLoan.structure = { ...newLoan.structure, offer };
      }
    } else {
      newLoan.structure = {};
    }

    return newLoan;
  }

  return { ...newLoan, structure: {} };
};
