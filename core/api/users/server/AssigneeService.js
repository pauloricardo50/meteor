import ErrorLogger from '../../errorLogger/server/ErrorLogger';
import IntercomService from '../../intercom/server/IntercomService';
import SecurityService from '../../security';
import { ROLES } from '../roles/roleConstants';
import { ASSIGNEE } from '../userConstants';
import UserService from './UserService';

class AssigneeService {
  constructor(newUserId) {
    this.init(newUserId);
  }

  init(newUserId) {
    this.newUserId = newUserId;
    this.advisors = UserService.fetch({
      $filters: { 'roles._id': ROLES.ADVISOR },
      $options: { sort: { createdAt: 1 } },
      isInRoundRobin: 1,
      roundRobinTimeout: 1,
    });
    this.roundRobinAdvisors = this.advisors.filter(
      ({ isInRoundRobin }) => isInRoundRobin,
    );
    this.unavailableAdvisors = this.advisors.filter(
      ({ roundRobinTimeout }) => !!roundRobinTimeout,
    );

    if (!newUserId) {
      return;
    }

    const {
      referredByUser,
      referredByOrganisation,
      loans = [],
      roles,
    } = UserService.get(newUserId, {
      loans: { promotions: { assignedEmployeeId: 1 } },
      referredByUser: {
        assignedEmployeeId: 1,
        organisations: { assigneeLink: 1 },
      },
      referredByOrganisation: { assigneeLink: 1 },
      roles: 1,
    });

    this.promotionAssignee = loans[0]?.promotions?.[0]?.assignedEmployeeId;
    this.referredByUserAssignee = referredByUser?.assignedEmployeeId;
    const referredByUserMainOrganisation = referredByUser?.organisations?.find(
      ({ $metadata }) => $metadata.isMain,
    );
    this.referredByUserOrganisationAssignee =
      referredByUserMainOrganisation?.assigneeLink?._id;
    this.referredByOrganisationAssignee =
      referredByOrganisation?.assigneeLink?._id;
    this.shouldAutoAssign = SecurityService.hasAssignedRole(
      { roles },
      ROLES.USER,
    );
  }

  isAvailable(assigneeId) {
    if (!assigneeId) {
      return false;
    }

    // Do this in cases when devs or observers are assigned to users, just let them do it
    const isInList = this.advisors.some(({ _id }) => _id === assigneeId);
    return (
      !isInList ||
      !this.unavailableAdvisors.some(({ _id }) => _id === assigneeId)
    );
  }

  setAssignee(assigneeId) {
    if (!this.newUserId || assigneeId === ASSIGNEE.NONE) {
      return;
    }

    if (assigneeId === ASSIGNEE.ROUND_ROBIN) {
      const roundRobinAssignee = this.getRoundRobinAssigneeId();
      return this.setAssigneeId(roundRobinAssignee);
    }

    if (assigneeId) {
      return this.setAssigneeId(assigneeId);
    }

    if (!this.shouldAutoAssign) {
      return;
    }

    const suggestedAssignee = this.getSuggestedAssigneeId();

    if (suggestedAssignee) {
      return this.setAssigneeId(suggestedAssignee);
    }

    const roundRobinAssignee = this.getRoundRobinAssigneeId();
    return this.setAssigneeId(roundRobinAssignee);
  }

  setAssigneeId(assigneeId) {
    if (assigneeId) {
      UserService.addLink({
        id: this.newUserId,
        linkName: 'assignedEmployee',
        linkId: assigneeId,
      });

      IntercomService.updateContactOwner({
        userId: this.newUserId,
        adminId: assigneeId,
      });
    }
  }

  getSuggestedAssigneeId() {
    if (this.isAvailable(this.promotionAssignee)) {
      return this.promotionAssignee;
    }

    if (this.isAvailable(this.referredByUserAssignee)) {
      return this.referredByUserAssignee;
    }

    if (this.isAvailable(this.referredByUserOrganisationAssignee)) {
      return this.referredByUserOrganisationAssignee;
    }

    if (this.isAvailable(this.referredByOrganisationAssignee)) {
      return this.referredByOrganisationAssignee;
    }

    return false;
  }

  getRoundRobinAssigneeId() {
    if (this.roundRobinAdvisors.length === 0) {
      return this.advisors[0]?._id;
    }

    // Get the last user created by a round-robin advisor
    // ignore users assigned to non-round-robin advisors
    const previouslyCreatedUser = UserService.get(
      {
        roles: { $elemMatch: { _id: ROLES.USER, assigned: true } },
        assignedEmployeeId: {
          $in: this.roundRobinAdvisors.map(({ _id }) => _id),
        },
      },
      {
        $options: { sort: { createdAt: -1 } },
        assignedEmployeeId: 1,
        createdAt: 1,
      },
    );

    let roundRobinIndex = 0;

    if (previouslyCreatedUser?.assignedEmployeeId) {
      const index = this.roundRobinAdvisors.findIndex(
        ({ _id }) => _id === previouslyCreatedUser.assignedEmployeeId,
      );

      // If we've gone around all advisors, start again
      if (index >= this.roundRobinAdvisors.length - 1) {
        roundRobinIndex = 0;
      } else {
        // Otherwise get the next advisor
        roundRobinIndex = index + 1;
      }
    }

    const allAreUnavailable = this.roundRobinAdvisors.every(
      ({ roundRobinTimeout }) => !!roundRobinTimeout,
    );

    // Escape hatch, if all advisors are unavailable, ignore their unavailability
    // Avoids infinite loops in the while loop below
    if (allAreUnavailable) {
      return this.roundRobinAdvisors[roundRobinIndex]._id;
    }

    const isUnavailable = index =>
      !this.isAvailable(this.roundRobinAdvisors[index]._id);

    while (isUnavailable(roundRobinIndex)) {
      if (roundRobinIndex >= this.roundRobinAdvisors.length - 1) {
        roundRobinIndex = 0;
      } else {
        roundRobinIndex += 1;
      }
    }

    return this.roundRobinAdvisors[roundRobinIndex]._id;
  }

  static assignAdminToUser = ({ userId, adminId }) => {
    const { assignedEmployee: oldAssignee = {} } =
      UserService.get(userId, { assignedEmployee: { name: 1 } }) || {};

    if (adminId) {
      const newAssignee = UserService.get(adminId, { name: 1 }) || {};

      UserService.update({ userId, object: { assignedEmployeeId: adminId } });

      try {
        IntercomService.updateContactOwner({ userId, adminId });
      } catch (error) {
        ErrorLogger.logError({ error });
      }

      return { oldAssignee, newAssignee };
    }

    UserService._update({
      id: userId,
      object: { assignedEmployeeId: true },
      operator: '$unset',
    });
    return { oldAssignee, newAssignee: { _id: adminId, name: 'Personne' } };
  };
}

export default AssigneeService;
