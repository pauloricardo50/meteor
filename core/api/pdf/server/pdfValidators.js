import Calculator from '../../../utils/Calculator';
import { makeCheckObjectStructure } from '../../../utils/checkObjectStructure';
import { PDF_TYPES } from '../pdfConstants';
import { frenchErrors } from './pdfHelpers';

const TEMPLATES = {
  [PDF_TYPES.LOAN]: {
    name: 1,
    purchaseType: 1,
    residenceType: 1,
    disbursementDate: { $or: 'structure.refinancingDate' },
    borrowers: [
      {
        gender: 1,
        zipCode: { $or: 'sameAddress' },
        city: { $or: 'sameAddress' },
        email: 1,
        phoneNumber: 1,
        activityType: 1,
      },
    ],
    structure: 1,
    user: {
      assignedEmployee: {
        name: 1,
        email: 1,
        phoneNumbers: [1],
      },
    },
  },
};

export const validateLoanPdf = ({ loan, structureIds }) => {
  const checkObjectStructure = makeCheckObjectStructure(frenchErrors);
  checkObjectStructure({ obj: loan, template: TEMPLATES[PDF_TYPES.LOAN] });

  const structures = loan.structures.filter(({ id }) =>
    structureIds.includes(id),
  );

  const property = Calculator.selectProperty({
    loan,
    structureId: structureIds[0],
  });

  checkObjectStructure({
    obj: { property },
    template: {
      property: {
        propertyType: 1,
        address1: 1,
        zipCode: 1,
        city: 1,
      },
    },
  });

  let id;
  structures.forEach(
    ({ id: structureId, propertyId, promotionOptionId, ownFunds = [] }) => {
      if (!id) {
        id = propertyId || promotionOptionId;
      } else if (id !== propertyId && id !== promotionOptionId) {
        throw 'Tous les biens immo doivent être les mêmes sur chaque plan financier du PDF';
      }

      if (
        Calculator.getRequiredOwnFunds({ loan, structureId }) &&
        !ownFunds.length
      ) {
        throw 'Fonds propres ne doit pas être vide dans Plans financiers';
      }
    },
  );
};
