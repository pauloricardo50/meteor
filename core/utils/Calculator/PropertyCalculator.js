// @flow
import {
  getPropertyArray,
  getPropertyLoanArray,
} from '../../arrays/PropertyFormArray';
import { getPercent } from '../general';
import { getCountedArray, getMissingFieldIds } from '../formArrayHelpers';
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

    propertyPercent({ loan, structureId, property }) {
      const { borrowers } = loan;
      const structure = this.selectStructure({ loan, structureId });
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

    getPropAndWork({ loan, structureId }) {
      const propertyValue = this.selectPropertyValue({ loan, structureId });
      const propertyWork = this.selectStructureKey({
        loan,
        structureId,
        key: 'propertyWork',
      }) || 0;
      return super.getPropAndWork({ propertyValue, propertyWork });
    }

    getPropertyWork({ loan, structureId }) {
      return this.selectPropertyWork({ loan, structureId });
    }

    getPropertyFilesProgress({ loan, structureId, property }) {
      const structure = this.selectStructure({ loan, structureId });
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

    getPropertyCompletion({ loan, structureId, property }) {
      const { borrowers } = loan;
      const selectedProperty = this.selectProperty({ loan, structureId });
      const propertyToCalculateWith = property || selectedProperty;

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

    getMissingPropertyFields({ loan, structureId, property }) {
      const { borrowers } = loan;
      const selectedProperty = this.selectProperty({ loan, structureId });

      const propertyToCalculateWith = property || selectedProperty;

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

    getMissingPropertyDocuments({ loan, structureId, property }) {
      const selectedProperty = this.selectProperty({ loan, structureId });
      const propertyToCalculateWith = property || selectedProperty;

      return getMissingDocumentIds({
        doc: propertyToCalculateWith,
        fileArray: getPropertyDocuments({
          loan,
          id: propertyToCalculateWith._id,
        }),
      });
    }

    hasDetailedPropertyValue({ loan, structureId }) {
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

    isPromotionProperty({ loan, structureId }) {
      const structure = this.selectStructure({ loan, structureId });
      return !!structure.promotionOptionId;
    }
  };
