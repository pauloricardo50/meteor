import UserService from '../users/server/UserService';
import { fullUser } from '../fragments';

const assigneeReducer = (body = {}, getUserId) => ({
  assignee: {
    body: {
      userId: 1,
      userLinks: 1,
      promotions: { userLinks: 1 },
      promotion: { userLinks: 1 },
      assignedEmployeeId: 1,
      ...body,
    },
    reduce(data) {
      const {
        userId,
        userLinks,
        promotion,
        promotions,
        assignedEmployeeId,
      } = data;
      let userToFind = userId;
      let users = userLinks;

      if (assignedEmployeeId) {
        return UserService.get(assignedEmployeeId, fullUser());
      }

      if (promotion && promotion.userLinks) {
        users = promotion.userLinks;
      }

      if (promotions && promotions.length > 0) {
        users = promotions[0].userLinks;
      }

      if (!userToFind && users && users.length > 0) {
        userToFind = users[0]._id;
      }

      if (!userToFind && getUserId) {
        userToFind = getUserId(data);
      }

      if (userToFind) {
        const user = UserService.get(userToFind, { assignedEmployeeId: 1 });
        if (user) {
          return UserService.get(user.assignedEmployeeId, fullUser());
        }
      }

      return null;
    },
  },
});

export default assigneeReducer;
