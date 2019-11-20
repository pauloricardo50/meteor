import { Meteor } from 'meteor/meteor';

import LoanService from '../../loans/server/LoanService';
import CollectionService from '../../helpers/CollectionService';
import {
  PROPERTY_PERMISSIONS_FULL_ACCESS,
  PROPERTY_CATEGORY,
} from '../propertyConstants';
import Properties from '../properties';
import UserService from '../../users/server/UserService';
import { removePropertyFromLoan } from './propertyServerHelpers';
import { HTTP_STATUS_CODES } from '../../RESTAPI/server/restApiConstants';

class PropertyService extends CollectionService {
  constructor() {
    super(Properties);
  }

  insert = ({ property, userId, loanId }) => {
    const propertyId = super.insert({ ...property, userId });
    if (loanId) {
      LoanService.addPropertyToLoan({ loanId, propertyId });
    }

    return propertyId;
  };

  update = ({ propertyId, object }) =>
    Properties.update(propertyId, { $set: object });

  remove = ({ propertyId, loanId }) => {
    const property = this.fetchOne({
      $filters: { _id: propertyId },
      loans: { _id: 1 },
      category: 1,
    });

    if (property && property.loans && property.loans.length > 1) {
      if (loanId) {
        const loansLink = this.getLink(propertyId, 'loans');
        loansLink.remove(loanId);
        return removePropertyFromLoan({
          loan: LoanService.findOne(loanId),
          propertyId,
        });
      }
      // Can't delete a property that has multiple loans without specifying
      // from where you want to remove it
      return false;
    }

    return Properties.remove(propertyId);
  };

  pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  pullValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pull: object });

  hasOneOfProperties = ({ userId, propertyIds }) =>
    propertyIds.some(propertyId =>
      UserService.hasProperty({ userId, propertyId }),
    );

  inviteUser = ({ propertyIds, userId, shareSolvency }) => {
    if (this.hasOneOfProperties({ userId, propertyIds })) {
      throw new Meteor.Error(
        HTTP_STATUS_CODES.CONFLICT,
        'Ce client est déjà invité à ce bien immobilier',
      );
    }

    LoanService.insertPropertyLoan({ userId, propertyIds, shareSolvency });
  };

  addProUser({ propertyId, userId }) {
    this.addLink({
      id: propertyId,
      linkName: 'users',
      linkId: userId,
      metadata: { permissions: {} },
    });
  }

  proPropertyInsert({ property, userId }) {
    const propertyId = this.insert({
      property: { ...property, category: PROPERTY_CATEGORY.PRO },
    });
    this.addLink({
      id: propertyId,
      linkName: 'users',
      linkId: userId,
      metadata: { permissions: PROPERTY_PERMISSIONS_FULL_ACCESS },
    });

    return propertyId;
  }

  setProUserPermissions({ propertyId, userId, permissions }) {
    this.updateLinkMetadata({
      id: propertyId,
      linkName: 'users',
      linkId: userId,
      metadata: { permissions },
    });
  }

  removeProFromProperty({ propertyId, proUserId }) {
    this.removeLink({ id: propertyId, linkName: 'users', linkId: proUserId });
  }

  removeCustomerFromProperty({ propertyId, loanId }) {
    const loan = LoanService.findOne({ _id: loanId });
    const { structures = [] } = loan;

    if (structures.length) {
      removePropertyFromLoan({ loan, propertyId });
    }

    this.removeLink({ id: propertyId, linkName: 'loans', linkId: loanId });
  }

  insertExternalProperty({ userId, property: { externalId, ...property } }) {
    const existingProperty = this.fetchOne({ $filters: { externalId } });

    if (existingProperty) {
      throw new Meteor.Error(
        `Property with externalId "${externalId}" exists already`,
      );
    }

    return this.proPropertyInsert({
      userId,
      property: { externalId, ...property },
    });
  }
}

export default new PropertyService();
