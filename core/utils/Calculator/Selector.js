import { createSelector } from 'reselect';

import { EMPTY_STRUCTURE } from '../../api/loans/loanConstants';

export const withSelector = (SuperClass = class {}) =>
  class extends SuperClass {
    selectProperty({ loan, structureId, property } = {}) {
      // In case you need to override this function
      if (property) {
        return property;
      }

      let propertyId = loan.structure && loan.structure.propertyId;
      let promotionOptionId =
        loan.structure && loan.structure.promotionOptionId;
      const structure = this.selectStructure({ loan, structureId });

      if (!structureId) {
        if (structure.property) {
          return structure.property;
        }

        if (structure.propertyId) {
          return loan.properties.find(
            ({ _id }) => _id === structure.propertyId,
          );
        }

        if (structure.promotionOption) {
          return this.formatPromotionOptionIntoProperty({
            loan,
            promotionOption: structure.promotionOption,
          });
        }

        if (structure.promotionOptionId) {
          const promotionOption = loan.promotionOptions.find(
            ({ _id }) => _id === structure.promotionOptionId,
          );

          return this.formatPromotionOptionIntoProperty({
            loan,
            promotionOption,
          });
        }

        if (loan.properties?.length === 1) {
          return loan.properties[0];
        }

        return {};
      }

      if (structureId) {
        propertyId = structure.propertyId;
        promotionOptionId = structure.promotionOptionId;
      }

      if (propertyId) {
        return loan.properties.find(({ _id }) => _id === propertyId);
      }

      if (promotionOptionId) {
        const promotionOption = loan.promotionOptions.find(
          ({ _id }) => _id === promotionOptionId,
        );
        return this.formatPromotionOptionIntoProperty({
          loan,
          promotionOption,
        });
      }

      return {};
    }

    selectOffers({ loan }) {
      const { lenders = [] } = loan;
      return lenders.reduce(
        (allOffers, { offers: o = [] }) => [...allOffers, ...o],
        [],
      );
    }

    selectOffer({ loan, structureId }) {
      const { offers = [], lenders = [] } = loan;
      const { offerId, offer } = this.selectStructure({ loan, structureId });

      if (offer) {
        return offer;
      }

      if (!offerId) {
        return undefined;
      }

      if (offers?.length) {
        return offers.find(({ _id }) => _id === offerId);
      }

      if (lenders?.length) {
        const lenderOffers = this.selectOffers({ loan });
        return lenderOffers.find(({ _id }) => _id === offerId);
      }
    }

    selectLenderRules({ loan, structureId }) {
      const { lenders = [], selectedLenderOrganisation, hasPromotion } = loan;

      if (!structureId && selectedLenderOrganisation?.lenderRules) {
        return selectedLenderOrganisation.lenderRules;
      }

      if (hasPromotion) {
        const { promotions = [] } = loan;
        if (promotions[0].lenderOrganisation?.lenderRules) {
          return promotions[0].lenderOrganisation.lenderRules;
        }
      }

      const { offerId } = this.selectStructure({ loan, structureId });

      if (offerId) {
        const lender = lenders.find(({ offers }) =>
          offers.some(({ _id }) => _id === offerId),
        );

        if (lender) {
          return lender.organisation.lenderRules;
        }
      }
    }

    selectStructure({ loan, structureId } = {}) {
      if (structureId) {
        return loan.structures.find(({ id }) => id === structureId);
      }
      return (
        loan.structure ||
        (loan.structures &&
          loan.structures.find(({ id }) => id === loan.selectedStructure)) ||
        EMPTY_STRUCTURE
      );
    }

    makeSelectPropertyKey(key) {
      return createSelector(
        this.selectProperty,
        property => property && property[key],
      );
    }

    selectStructureKey({ loan, structureId, key }) {
      return this.makeSelectStructureKey(key)({ loan, structureId });
    }

    selectPropertyKey({ loan, structureId, key, property }) {
      return this.makeSelectPropertyKey(key)({ loan, structureId, property });
    }

    makeSelectStructureKey(key) {
      return createSelector(
        this.selectStructure,
        structure => structure && structure[key],
      );
    }

    selectPropertyValue({ loan, structureId } = {}) {
      const structurePropertyValue = this.selectStructureKey({
        key: 'propertyValue',
        loan,
        structureId,
      });
      return (
        structurePropertyValue ||
        this.selectPropertyKey({ loan, structureId, key: 'totalValue' }) ||
        this.selectPropertyKey({ loan, structureId, key: 'value' }) ||
        0
      );
    }

    selectPropertyWork({ loan, structureId } = {}) {
      return this.selectStructureKey({
        loan,
        structureId,
        key: 'propertyWork',
      });
    }

    selectLoanValue({ loan, structureId } = {}) {
      return this.selectStructureKey({ loan, structureId, key: 'wantedLoan' });
    }

    getCashUsed = this.makeSelectStructureKey('fortuneUsed');

    selectLenderForOfferId({ loan, offerId }) {
      const { lenders = [] } = loan;
      return lenders.find(({ offers }) =>
        offers.some(({ _id }) => _id === offerId),
      );
    }
  };
