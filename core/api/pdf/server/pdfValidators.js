import { makeCheckObjectStructure } from 'core/utils/checkObjectStructure';
import { PDF_TYPES, TEMPLATES } from '../pdfConstants';
import { frenchErrors } from './pdfHelpers';

export const validateLoanPdf = ({ loan, structureIds }) => {
  const checkObjectStructure = makeCheckObjectStructure(frenchErrors);
  checkObjectStructure({ obj: loan, template: TEMPLATES[PDF_TYPES.LOAN] });

  const structures = loan.structures.filter(({ id }) =>
    structureIds.includes(id),
  );
  let id;

  structures.forEach(({ propertyId, promotionOptionId }) => {
    if (!id) {
      id = propertyId || promotionOptionId;
    } else if (id !== propertyId && id !== promotionOptionId) {
      throw 'Tous les biens immo doivent être les mêmes sur chaque plan financier du PDF';
    }
  });
};
