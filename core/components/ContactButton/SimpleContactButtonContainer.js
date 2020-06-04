import { withProps } from 'recompose';

import { employeesByEmail } from 'core/arrays/epotekEmployees';
import useCurrentUser from 'core/hooks/useCurrentUser';

export default withProps(() => {
  const currentUser = useCurrentUser();

  let staff;
  if (currentUser && currentUser.assignedEmployee) {
    staff = employeesByEmail[currentUser.assignedEmployee.email];
  }
  if (!staff) {
    staff = employeesByEmail['team@e-potek.ch'];
  }
  return { staff };
});
