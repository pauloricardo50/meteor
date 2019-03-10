import { Accounts } from 'meteor/accounts-base';

import { Meteor } from 'meteor/meteor';
import LoanService from '../../loans/server/LoanService';
import WuestService from '../../wuest/server/WuestService';
import CollectionService from '../../helpers/CollectionService';
import {
  VALUATION_STATUS,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../propertyConstants';
import Properties from '../properties';
import UserService from '../../users/server/UserService';
import { ROLES } from '../../users/userConstants';
import { removePropertyFromLoan } from './propertyServerHelpers';

export class PropertyService extends CollectionService {
  constructor() {
    super(Properties);
  }

  insert = ({ property, userId, loanId }) => {
    const propertyId = Properties.insert({ ...property, userId });
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

    if (property && property.loans.length > 1) {
      if (loanId) {
        const loansLink = this.getLink(propertyId, 'loans');
        loansLink.remove(loanId);
      } else {
        // Can't delete a property that has multiple loans without specifying
        // from where you want to remove it
        return false;
      }
    } else {
      Properties.remove(propertyId);
    }
  };

  pushValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $push: object });

  popValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pop: object });

  pullValue = ({ propertyId, object }) =>
    Properties.update(propertyId, { $pull: object });

  evaluateProperty = ({ propertyId, loanResidenceType }) =>
    WuestService.evaluateById({ propertyId, loanResidenceType })
      .then((valuation) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: VALUATION_STATUS.DONE,
              date: new Date(),
              error: '',
              ...valuation,
            },
          },
        });
      })
      .catch((error) => {
        this.update({
          propertyId,
          object: {
            valuation: {
              status: VALUATION_STATUS.ERROR,
              min: null,
              max: null,
              value: null,
              date: new Date(),
              error: error.reason || error.message,
            },
          },
        });
      });

  propertyDataIsInvalid = ({ propertyId, loanResidenceType }) => {
    try {
      WuestService.createPropertyFromCollection({
        propertyId,
        loanResidenceType,
      });
    } catch (error) {
      return error.reason;
    }
    return false;
  };

  inviteUser = ({
    proUserId,
    user: { email, firstName, lastName, phoneNumber },
    propertyId,
    sendInvitation,
  }) => {
    const property = this.get(propertyId);
    let assignedEmployeeId;
    let organisationId;

    if (proUserId) {
      const pro = UserService.fetchOne({
        $filters: { _id: proUserId },
        assignedEmployeeId: 1,
        organisations: { _id: 1 },
      });

      if (pro) {
        const {
          assignedEmployeeId: proAssignedEmployeeId,
          organisations = [],
        } = pro;
        assignedEmployeeId = proAssignedEmployeeId;
        organisationId = !!organisations.length && organisations[0]._id;
      }
    }

    let userId;
    let isNewUser = false;

    if (!UserService.doesUserExist({ email })) {
      isNewUser = true;
      const admin = UserService.get(assignedEmployeeId);
      userId = UserService.adminCreateUser({
        options: {
          email,
          sendEnrollmentEmail: false,
          firstName,
          lastName,
          phoneNumbers: [phoneNumber],
        },
        adminId: admin && admin._id,
      });
    } else {
      userId = UserService.findOne({
        'emails.address': { $in: [email] },
      })._id;
      if (UserService.hasProperty({ userId, propertyId })) {
        throw new Meteor.Error('Cet utilisateur est déjà invité à ce bien immobilier');
      }
    }

    if (proUserId) {
      UserService.addLink({
        id: userId,
        linkName: 'referredByUser',
        linkId: proUserId,
      });
    }

    if (organisationId) {
      UserService.addLink({
        id: userId,
        linkName: 'referredByOrganisation',
        linkId: organisationId,
      });
    }

    const loanId = LoanService.insertPropertyLoan({ userId, propertyId });

    console.log('Should send invitation to property loan!');
    if (sendInvitation) {
      // TODO:
    }
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
    const propertyId = Properties.insert(property);
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
}

export default new PropertyService();
