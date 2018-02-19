import Security from '../Security';
import { Tasks } from '../..';

class TaskSecurity {
  static isAllowedToInsert() {
    Security.checkLoggedIn();
  }

  static isAllowedToUpdate() {
    Security.checkCurrentUserIsAdmin();
  }

  static isAllowedToDelete() {
    Security.checkCurrentUserIsAdmin();
  }
}

export default TaskSecurity;
