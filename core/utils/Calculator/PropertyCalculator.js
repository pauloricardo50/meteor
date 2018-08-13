// @flow
import {
  getPropertyArray,
  getPropertyLoanArray,
} from '../../arrays/PropertyFormArray';
import { getPercent } from '../general';
import { getCountedArray } from '../formArrayHelpers';
import { FinanceCalculator } from '../FinanceCalculator';
import { filesPercent } from '../../api/files/fileHelpers';
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

    propertyPercent({ loan }) {
      const {
        borrowers,
        structure: { property },
      } = loan;
      const formArray1 = getPropertyArray({ loan, borrowers, property });
      const formArray2 = getPropertyLoanArray({
        loan,
        borrowers,
        property,
      });

      let a = getCountedArray(formArray1, property);
      a = [...a, getCountedArray(formArray2, loan)];

      return getPercent(a);
    }

    getPropAndWork({ loan }) {
      const propertyValue = this.getPropertyValue({ loan });
      const propertyWork = this.makeSelectStructureKey('propertyWork')({
        loan,
      });
      return super.getPropAndWork({ propertyValue, propertyWork });
    }

    getPropertyCompletion({ loan }) {
      const {
        borrowers,
        structure: { property },
      } = loan;
      const formsProgress = this.propertyPercent({ loan, borrowers, property });
      const filesProgress = filesPercent({
        doc: property,
        fileArrayFunc: propertyDocuments,
        step: FILE_STEPS.AUCTION,
      });

      return (formsProgress + filesProgress) / 2;
    }

    getTheoreticalMaintenance({ loan }) {
      return (
        (this.getPropAndWork({ loan }) * this.theoreticalMaintenanceRatio) / 12
      );
    }
  };

export const PropertyCalculator = withPropertyCalculator(FinanceCalculator);

export default new PropertyCalculator();
