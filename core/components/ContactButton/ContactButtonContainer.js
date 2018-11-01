import employees from 'core/arrays/epotekEmployees';

import { compose, withProps, withState } from 'recompose';
import { withSmartQuery } from '../../api';
import appUserQuery from '../../api/users/queries/appUser';

const getStaffByEmail = email =>
  employees.find(employee => employee.email === email);

const ContactButtonContainer = compose(
  withSmartQuery({
    query: appUserQuery,
    dataName: 'currentUser',
    queryOptions: { single: true, reactive: true },
    renderMissingDoc: false,
  }),
  withProps(({ currentUser }) => {
    let staff;
    if (currentUser && currentUser.assignedEmployee) {
      staff = getStaffByEmail(currentUser.assignedEmployee.email);
    }
    if (!staff) {
      staff = getStaffByEmail('yannis@e-potek.ch');
    }
    return { staff };
  }),
  withState('open', 'toggleOpen', false),
);

export default ContactButtonContainer;
