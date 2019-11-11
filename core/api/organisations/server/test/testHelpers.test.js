import {
  ORGANISATION_TYPES,
  ORGANISATION_FEATURES,
} from '../../organisationConstants';

export const generateOrganisationsWithLenderRules = ({
  number,
  mainBorrowRatio,
  secondaryBorrowRatio,
}) => {
  const { min: minMainBorrowRatio, max: maxMainBorrowRatio } = mainBorrowRatio;
  const {
    min: minSecondaryBorrowRatio,
    max: maxSecondaryBorrowRatio,
  } = secondaryBorrowRatio;
  let organisations = [];
  Array(number)
    .fill()
    .map((_, x) => x)
    .forEach(index => {
      const mainRange = maxMainBorrowRatio - minMainBorrowRatio;
      const mainStep = number > 1 ? mainRange / (number - 1) : 0;
      const secondaryRange = maxSecondaryBorrowRatio - minSecondaryBorrowRatio;
      const secondaryStep = number > 1 ? secondaryRange / (number - 1) : 0;

      const main = minMainBorrowRatio + index * mainStep;
      const secondary = minSecondaryBorrowRatio + index * secondaryStep;

      organisations = [
        ...organisations,
        {
          name: `org${index}`,
          type: ORGANISATION_TYPES.BANK,
          features: [ORGANISATION_FEATURES.LENDER],
          lenderRules: [
            { _factory: 'lenderRulesAll', order: 0 },
            { _factory: 'lenderRulesMain', maxBorrowRatio: main, order: 1 },
            {
              _factory: 'lenderRulesSecondary',
              maxBorrowRatio: secondary,
              order: 2,
            },
          ],
        },
      ];
    });

  return organisations;
};
