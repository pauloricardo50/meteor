// @flow
import { PURCHASE_TYPE } from 'core/redux/widget1/widget1Constants';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import {
  getPropertyArray,
  getPropertyLoanArray,
} from '../../arrays/PropertyFormArray';
import { getPercent } from '../general';
import {
  getCountedArray,
  getMissingFieldIds,
  getRequiredFieldIds,
} from '../formArrayHelpers';
import {
  filesPercent,
  getMissingDocumentIds,
  getRequiredDocumentIds,
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
      const propertyWork =
        this.selectStructureKey({
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

    getRequiredPropertyFields({ loan, structureId, property }) {
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
        ...getRequiredFieldIds(formArray1, propertyToCalculateWith),
        ...getRequiredFieldIds(formArray2, loan),
      ];
    }

    getValidPropertyFieldsRatio({ loan, structureId, property }) {
      const requiredFields = this.getRequiredPropertyFields({
        loan,
        structureId,
        property,
      });
      const missingFields = this.getMissingPropertyFields({
        loan,
        structureId,
        property,
      });
      return {
        valid: requiredFields.length - missingFields.length,
        required: requiredFields.length,
      };
    }

    getMissingPropertyDocuments({ loan, structureId, property, basicDocumentsOnly }) {
      const selectedProperty = this.selectProperty({ loan, structureId });
      const propertyToCalculateWith = property || selectedProperty;

      return getMissingDocumentIds({
        doc: propertyToCalculateWith,
        fileArray: getPropertyDocuments({
          loan,
          id: propertyToCalculateWith._id,
        }),
        basicDocumentsOnly,
      });
    }

    getRequiredPropertyDocumentIds({ loan, structureId, property }) {
      const selectedProperty = this.selectProperty({ loan, structureId });
      const propertyToCalculateWith = property || selectedProperty;

      return getRequiredDocumentIds(
        getPropertyDocuments({ loan, id: propertyToCalculateWith._id }),
      );
    }

    getValidPropertyDocumentsRatio({ loan, structureId, property }) {
      const requiredDocuments = this.getRequiredPropertyDocumentIds({
        loan,
        structureId,
        property,
      });
      const missingDocuments = this.getMissingPropertyDocuments({
        loan,
        structureId,
        property,
      });

      return {
        valid: requiredDocuments.length - missingDocuments.length,
        required: requiredDocuments.length,
      };
    }

    hasDetailedPropertyValue({ loan, structureId }) {
      const propertyExactValue = this.selectPropertyKey({
        key: 'value',
        loan,
        structureId,
      });
      const landValue = this.selectPropertyKey({
        key: 'landValue',
        loan,
        structureId,
      });
      const constructionValue = this.selectPropertyKey({
        key: 'constructionValue',
        loan,
        structureId,
      });

      return !propertyExactValue || !!(landValue && constructionValue);
    }

    isPromotionProperty({ loan, structureId }) {
      const structure = this.selectStructure({ loan, structureId });
      return !!structure.promotionOptionId;
    }

    isNewProperty({ loan, structureId }) {
      return !!(
        this.isPromotionProperty({ loan, structureId }) ||
        this.selectPropertyKey({ loan, structureId, key: 'isNew' }) ||
        loan.purchaseType === PURCHASE_TYPE.CONSTRUCTION
      );
    }

    isUserProperty({ loan, structureId }) {
      const propertyCategory = this.selectPropertyKey({
        loan,
        structureId,
        key: 'category',
      });

      return propertyCategory === PROPERTY_CATEGORY.USER;
    }
  };
