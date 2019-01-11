import TaskService from '../tasks/server/TaskService';

const tasksReducer = {
  tasks: {
    body: { _id: 1 },
    reduce({ _id: docId }) {
      return TaskService.getTasksForDoc(docId);
    },
  },
};

export default tasksReducer;
