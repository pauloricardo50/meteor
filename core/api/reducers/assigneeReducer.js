import UserService from '../users/server/UserService';

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
        return UserService.findOne({ _id: assignedEmployeeId });
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
        const user = UserService.findOne({ _id: userToFind });
        if (user) {
          return UserService.findOne({ _id: user.assignedEmployeeId });
        }
      }

      return null;
    },
  },
});

export default assigneeReducer;
