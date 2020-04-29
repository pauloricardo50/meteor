import { withProps } from 'recompose';

import { employeesByEmail } from 'core/arrays/epotekEmployees';

export default withProps(({ currentUser }) => {
  let staff;
  if (currentUser && currentUser.assignedEmployee) {
    staff = employeesByEmail[currentUser.assignedEmployee.email];
  }
  if (!staff) {
    staff = employeesByEmail['team@e-potek.ch'];
  }
  return { staff };
});
