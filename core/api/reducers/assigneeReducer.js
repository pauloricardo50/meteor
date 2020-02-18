import UserService from '../users/server/UserService';

// Use this fragment for slack notifications (get the slack channel name), etc.
const fragment = { email: 1, name: 1 };

const assigneeReducer = (body = {}, getUserId) => ({
  assignee: {
    body: {
      userId: 1,
      userLinks: 1,
      promotions: { userLinks: 1 },
      promotion: { userLinks: 1 },
      assignedEmployeeId: 1,
      assigneeLinks: 1,
      assigneeLink: 1,
      ...body,
    },
    reduce(data) {
      const {
        userId,
        userLinks,
        promotion,
        promotions,
        assignedEmployeeId,
        assigneeLinks,
        assigneeLink,
      } = data;
      let userToFind = userId;
      let users = userLinks;

      if (assigneeLink) {
        // Revenues collection
        return UserService.get(assigneeLink._id, fragment);
      }

      if (assigneeLinks?.length) {
        // Loans collection
        const main = assigneeLinks.find(({ isMain }) => isMain);

        // For anonymous loans, no assignee
        if (main) {
          return UserService.get(main._id, fragment);
        }
      }

      if (assignedEmployeeId) {
        // Users collection
        return UserService.get(assignedEmployeeId, fragment);
      }

      if (promotion?.userLinks) {
        // promotionLots, promotionOptions collections
        users = promotion.userLinks;
      }

      if (promotions?.length) {
        // Loans collection fallback
        users = promotions[0].userLinks;
      }

      if (!userToFind && users?.length) {
        // If this document has a list of users assigned to it, pick the first
        // one and use his assignee
        userToFind = users[0]._id;
      }

      if (!userToFind && getUserId) {
        // fallback in case the assignee is hard to get
        userToFind = getUserId(data);
      }

      if (userToFind) {
        // In case we've found the user who owns this document, return his assignee
        const user = UserService.get(userToFind, { assignedEmployeeId: 1 });
        if (user) {
          return UserService.get(user.assignedEmployeeId, fragment);
        }
      }

      return null;
    },
  },
});

export default assigneeReducer;
