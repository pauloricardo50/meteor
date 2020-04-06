const mainAssigneeReducer = {
  body: { assigneeLinks: 1, assignees: { name: 1, email: 1 } },
  reduce: ({ assigneeLinks = [], assignees = [] }) => {
    // FIXME: For some weird reason, the $metadata is not included
    // in the assignees array
    const mainAssignee = assigneeLinks.find(({ isMain }) => isMain);

    return mainAssignee
      ? assignees.find(({ _id }) => mainAssignee._id === _id)
      : undefined;
  },
};

export default mainAssigneeReducer;
