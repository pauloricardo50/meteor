// @flow
import { createSelector } from 'reselect';
import { userLoan, userProperty } from '../../api/types';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({
      loan,
      structureId,
    }: { loan: userLoan } = {}): userProperty {
      let propertyId = loan.structure && loan.structure.propertyId;
      let promotionOptionId = loan.structure && loan.structure.promotionOptionId;

      if (!structureId) {
        return (
          loan.structure.property
          || this.formatPromotionOptionIntoProperty(loan.structure.promotionOption)
          || {}
        );
      }

      if (structureId) {
        propertyId = loan.structures.find(({ id }) => id === structureId)
          .propertyId;
        promotionOptionId = loan.structures.find(({ id }) => id === structureId)
          .promotionOptionId;
      }

      if (propertyId) {
        return loan.properties.find(({ _id }) => _id === propertyId);
      }

      if (promotionOptionId) {
        return this.formatPromotionOptionIntoProperty(loan.promotionOptions.find(({ _id }) => _id === promotionOptionId));
      }

      return {};
    }

    selectStructure({ loan, structureId }: { loan: userLoan } = {}): {} {
      if (structureId) {
        return loan.structures.find(({ id }) => id === structureId);
      }
      return loan.structure;
    }

    makeSelectPropertyKey(key: string): Function {
      return createSelector(
        this.selectProperty,
        property => property && property[key],
      );
    }

    selectStructureKey({ loan, structureId, key }) {
      return this.makeSelectStructureKey(key)({ loan, structureId });
    }

    makeSelectStructureKey(key: string): Function {
      return createSelector(
        this.selectStructure,
        structure => structure[key],
      );
    }

    selectPropertyValue({
      loan,
      structureId,
    }: { loan: userLoan } = {}): number {
      const structurePropertyValue = this.selectStructureKey({
        key: 'propertyValue',
        loan,
        structureId,
      });
      return (
        structurePropertyValue
        || this.makeSelectPropertyKey('value')({ loan, structureId })
      );
    }

    selectPropertyWork({ loan }: { loan: userLoan } = {}): number {
      return this.makeSelectStructureKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan, structureId }: { loan: userLoan } = {}): number {
      return this.selectStructure({ loan, structureId }).wantedLoan;
    }

    getCashUsed = this.makeSelectStructureKey('fortuneUsed');
  };

export const Selector = withSelector();

export default new Selector();
