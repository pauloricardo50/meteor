import { PURCHASE_TYPE } from '../../../redux/widget1/widget1Constants';
import Calculator from '../../../utils/Calculator';
import { makeCheckObjectStructure } from '../../../utils/checkObjectStructure';
import { PDF_TYPES, TEMPLATES } from '../pdfConstants';
import { frenchErrors } from './pdfHelpers';

export const validateLoanPdf = ({ loan, structureIds }) => {
  const checkObjectStructure = makeCheckObjectStructure(frenchErrors);
  checkObjectStructure({ obj: loan, template: TEMPLATES[PDF_TYPES.LOAN] });
  const isRefinancing = loan?.purchaseType === PURCHASE_TYPE.REFINANCING;

  const structures = loan.structures.filter(({ id }) =>
    structureIds.includes(id),
  );
  let id;

  structures.forEach(
    ({ id: structureId, propertyId, promotionOptionId, ownFunds = [] }) => {
      if (!id) {
        id = propertyId || promotionOptionId;
      } else if (id !== propertyId && id !== promotionOptionId) {
        throw 'Tous les biens immo doivent être les mêmes sur chaque plan financier du PDF';
      }

      if (!isRefinancing && !ownFunds.length) {
        throw 'Fonds propres ne doit pas être vide dans Plans financiers';
      }

      if (
        isRefinancing &&
        Calculator.getRefinancingRequiredOwnFunds({ loan, structureId }) > 0 &&
        !ownFunds.length
      ) {
        throw 'Fonds propres ne doit pas être vide dans Plans financiers';
      }
    },
  );
};
