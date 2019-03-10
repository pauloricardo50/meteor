// @flow
import { createSelector } from 'reselect';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({ loan, structureId } = {}) {
      let propertyId = loan.structure && loan.structure.propertyId;
      let promotionOptionId = loan.structure && loan.structure.promotionOptionId;
      const structure = this.selectStructure({ loan, structureId });

      if (!structureId) {
        return (
          structure.property
          || (structure.propertyId
            && loan.properties.find(({ _id }) => _id === structure.propertyId))
          || this.formatPromotionOptionIntoProperty(structure.promotionOption)
          || {}
        );
      }

      if (structureId) {
        propertyId = structure.propertyId;
        promotionOptionId = structure.promotionOptionId;
      }

      if (propertyId) {
        return loan.properties.find(({ _id }) => _id === propertyId);
      }

      if (promotionOptionId) {
        return this.formatPromotionOptionIntoProperty(loan.promotionOptions.find(({ _id }) => _id === promotionOptionId));
      }

      return {};
    }

    selectOffer({ loan, structureId }) {
      const { offers = [] } = loan;
      const { offerId, offer } = this.selectStructure({ loan, structureId });

      if (offer) {
        return offer;
      }

      if (!offerId) {
        return undefined;
      }

      return offers.find(({ _id }) => _id === offerId);
    }

    selectStructure({ loan, structureId } = {}): {} {
      if (structureId) {
        return loan.structures.find(({ id }) => id === structureId);
      }
      return (
        loan.structure
        || loan.structures.find(({ id }) => id === loan.selectedStructure)
      );
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

    selectPropertyKey({ loan, structureId, key }) {
      return this.makeSelectPropertyKey(key)({ loan, structureId });
    }

    makeSelectStructureKey(key: string): Function {
      return createSelector(
        this.selectStructure,
        structure => structure && structure[key],
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
        || this.selectPropertyKey({ loan, structureId, key: 'totalValue' })
        || this.selectPropertyKey({ loan, structureId, key: 'value' })
      );
    }

    selectPropertyWork({ loan } = {}): number {
      return this.makeSelectStructureKey('propertyWork')({ loan });
    }

    selectLoanValue({ loan, structureId } = {}): number {
      return this.selectStructure({ loan, structureId }).wantedLoan;
    }

    getCashUsed = this.makeSelectStructureKey('fortuneUsed');
  };
