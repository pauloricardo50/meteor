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
import { propertyDocuments } from '../../api/files/documents';
import { FILE_STEPS } from '../../api/constants';
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
      const propertyValue = this.selectPropertyValue({ loan });
      const propertyWork = this.makeSelectStructureKey('propertyWork')({
        loan,
      });
      return super.getPropAndWork({ propertyValue, propertyWork });
    }

    getPropertyFilesProgress({ loan, property }) {
      const { structure } = loan;
      const propertyToCalculateWith = property || structure.property;

      if (!propertyToCalculateWith) {
        return 0;
      }

      return filesPercent({
        doc: propertyToCalculateWith,
        fileArrayFunc: propertyDocuments,
        step: FILE_STEPS.AUCTION,
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
        property: propertyToCalculateWith,
      });

      return (formsProgress + filesProgress) / 2;
    }

    getTheoreticalMaintenance({ loan }) {
      return (
        (this.getPropAndWork({ loan }) * this.theoreticalMaintenanceRatio) / 12
      );
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
        fileArrayFunc: propertyDocuments,
        step: FILE_STEPS.AUCTION,
      });
    }
  };

export const PropertyCalculator = withPropertyCalculator(FinanceCalculator);

export default new PropertyCalculator();
