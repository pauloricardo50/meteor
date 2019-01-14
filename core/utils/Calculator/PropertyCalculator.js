// @flow
import {
  getPropertyArray,
  getPropertyLoanArray,
} from '../../arrays/PropertyFormArray';
import { getPercent } from '../general';
import { getCountedArray, getMissingFieldIds } from '../formArrayHelpers';
import { FinanceCalculator } from '../FinanceCalculator';
import {
  filesPercent,
  getMissingDocumentIds,
} from '../../api/files/fileHelpers';
import { getPropertyDocuments } from '../../api/files/documents';
import MiddlewareManager from '../MiddlewareManager';

export const withPropertyCalculator = (SuperClass = class {}) =>
  class extends SuperClass {
    constructor(config) {
      super(config);
      this.initPropertyCalculator(config);
    }

    initPropertyCalculator(config) {
      if (config && config.propertyMiddleware) {
        const middlewareManager = new MiddlewareManager(this);
        middlewareManager.applyToAllMethods([config.propertyMiddleware]);
      }
    }

    propertyPercent({ loan, property }) {
      const { borrowers, structure } = loan;
      const propertyToCalculateWith = property || structure.property;

      if (!propertyToCalculateWith) {
        return 0;
      }

      const formArray1 = getPropertyArray({
        loan,
        borrowers,
        property: propertyToCalculateWith,
      });
      const formArray2 = getPropertyLoanArray({
        loan,
        borrowers,
        property: propertyToCalculateWith,
      });

      return getPercent([
        ...getCountedArray(formArray1, propertyToCalculateWith),
        ...getCountedArray(formArray2, loan),
      ]);
    }

    getPropAndWork({ loan }) {
      const propertyValue = this.getPropertyValue({ loan });
      const propertyWork = this.makeSelectStructureKey('propertyWork')({
        loan,
      });
      return super.getPropAndWork({ propertyValue, propertyWork });
    }

    getPropertyWork({ loan }) {
      return this.selectPropertyWork({ loan });
    }

    getPropertyFilesProgress({ loan, property }) {
      const { structure } = loan;
      const propertyToCalculateWith = property || structure.property;

      if (!propertyToCalculateWith) {
        return 0;
      }

      return filesPercent({
        doc: propertyToCalculateWith,
        fileArray: getPropertyDocuments({
          loan,
          id: propertyToCalculateWith._id,
        }),
      });
    }

    getPropertyCompletion({ loan, property }) {
      const { borrowers, structure } = loan;
      const propertyToCalculateWith = property || structure.property;

      const formsProgress = this.propertyPercent({
        loan,
        borrowers,
        property: propertyToCalculateWith,
      });
      const filesProgress = this.getPropertyFilesProgress({
        loan,
        property: propertyToCalculateWith,
      });

      return (formsProgress + filesProgress) / 2;
    }

    getMissingPropertyFields({ loan, property }) {
      const { borrowers, structure } = loan;
      const propertyToCalculateWith = property || structure.property;

      const formArray1 = getPropertyArray({
        loan,
        borrowers,
        property: propertyToCalculateWith,
      });
      const formArray2 = getPropertyLoanArray({
        loan,
        borrowers,
        property: propertyToCalculateWith,
      });

      return [
        ...getMissingFieldIds(formArray1, propertyToCalculateWith),
        ...getMissingFieldIds(formArray2, loan),
      ];
    }

    getMissingPropertyDocuments({ loan, property }) {
      const { structure } = loan;
      const propertyToCalculateWith = property || (structure && structure.property);

      return getMissingDocumentIds({
        doc: propertyToCalculateWith,
        fileArray: getPropertyDocuments({
          loan,
          id: propertyToCalculateWith._id,
        }),
      });
    }

    getPropertyValue({ loan }) {
      return loan.structure.propertyValue || this.selectPropertyValue({ loan });
    }

    hasDetailedPropertyValue({ loan, structureId }) {
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const propertyExactValue = this.makeSelectPropertyKey('value')({
        loan,
        structureId,
      });
      const landValue = this.makeSelectPropertyKey('landValue')({
        loan,
        structureId,
      });
      const constructionValue = this.makeSelectPropertyKey('constructionValue')({
        loan,
        structureId,
      });

      return !propertyExactValue || !!(landValue && constructionValue);
    }
  };

export const PropertyCalculator = withPropertyCalculator(FinanceCalculator);

export default new PropertyCalculator();
