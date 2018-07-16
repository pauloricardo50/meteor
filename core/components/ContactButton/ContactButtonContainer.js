import employees from 'core/arrays/epotekEmployees';

import { compose, withProps, withState } from 'recompose';
import { withSmartQuery } from '../../api';
import currentUserQuery from '../../api/users/queries/currentUser';

const getStaffByEmail = email =>
  employees.find(employee => employee.email === email);

const ContactButtonContainer = compose(
  withSmartQuery({
    query: () => currentUserQuery.clone(),
    dataName: 'currentUser',
    queryOptions: {
      single: true,
      reactive: true,
    },
    renderMissingDoc: false,
  }),
  withProps(({ currentUser }) => {
    if (!currentUser.assignedEmployee) {
      return {
        staff: getStaffByEmail('yannis@e-potek.ch'),
      };
    }
    return {
      staff: getStaffByEmail(currentUser.assignedEmployee.emails[0].address),
    };
  }),
  withState('open', 'toggleOpen', false),
);

export default ContactButtonContainer;
