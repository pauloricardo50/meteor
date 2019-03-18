import { Meteor } from 'meteor/meteor';

import { EMAIL_IDS } from 'core/api/email/emailConstants';
import { sendEmail } from 'core/api/methods/index';
import LoanService from '../../loans/server/LoanService';
import WuestService from '../../wuest/server/WuestService';
import CollectionService from '../../helpers/CollectionService';
import {
  VALUATION_STATUS,
  PROPERTY_PERMISSIONS_FULL_ACCESS,
} from '../propertyConstants';
import Properties from '../properties';
import UserService from '../../users/server/UserService';
import { removePropertyFromLoan } from './propertyServerHelpers';
import { getUserNameAndOrganisation } from '../../helpers';

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
    propertyIds,
    sendInvitation = true,
  }) => {
    const properties = propertyIds.map(propertyId => this.get(propertyId));
    let assignedEmployeeId;
    let organisationId;
    let pro;

    if (proUserId) {
      pro = UserService.fetchOne({
        $filters: { _id: proUserId },
        name: 1,
        assignedEmployeeId: 1,
        organisations: { name: 1 },
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

    const isNewUser = !UserService.doesUserExist({ email });
    let userId;
    let admin;

    if (isNewUser) {
      admin = UserService.get(assignedEmployeeId);
      userId = UserService.adminCreateUser({
        options: {
          email,
          // If an admin does the invitation, send him the default enrollment email
          // and skip the property invitation email
          sendEnrollmentEmail: sendInvitation && !pro,
          firstName,
          lastName,
          phoneNumbers: [phoneNumber],
        },
        adminId: admin && admin._id,
      });

      if (!pro) {
        // The invitation has already been sent
        sendInvitation = false;
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
    } else {
      const {
        _id: existingUserId,
        assignedEmployeeId: existingAssignedEmployeeId,
      } = UserService.findOne({ 'emails.address': { $in: [email] } });
      admin = UserService.get(existingAssignedEmployeeId);
      userId = existingUserId;

      if (
        propertyIds.some(propertyId =>
          UserService.hasProperty({ userId, propertyId }))
      ) {
        throw new Meteor.Error('Cet utilisateur est déjà invité à ce bien immobilier');
      }
    }

    const loanId = LoanService.insertPropertyLoan({ userId, propertyIds });

    if (sendInvitation) {
      return this.sendPropertyInvitationEmail({
        userId,
        isNewUser,
        address: properties[0].address1, // TODO: all addresses
        proName: pro ? getUserNameAndOrganisation({ user: pro }) : admin.name,
      });
    }

    return Promise.resolve();
  };

  sendPropertyInvitationEmail({ userId, isNewUser, proName, address }) {
    let ctaUrl = Meteor.settings.public.subdomains.app;

    if (isNewUser) {
      // Envoyer invitation avec enrollment link
      ctaUrl = UserService.getEnrollmentUrl({ userId });
    }

    return sendEmail.run({
      emailId: EMAIL_IDS.INVITE_USER_TO_PROPERTY,
      userId,
      params: { proName, address, ctaUrl },
    });
  }

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

  insertExternalProperty({ userId, externalId, ...property }) {
    const existingProperty = this.fetchOne({ $filters: { externalId } });

    if (existingProperty) {
      throw new Meteor.Error(`Property with externalId "${externalId}" exists already`);
    }

    this.proPropertyInsert({ userId, property: { externalId, ...property } });
  }
}

export default new PropertyService();
