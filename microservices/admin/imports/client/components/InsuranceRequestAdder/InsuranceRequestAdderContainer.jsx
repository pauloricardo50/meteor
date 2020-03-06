import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import uniqBy from 'lodash/uniqBy';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { insuranceRequestInsert } from 'core/api/insuranceRequests/methodDefinitions';
import { USERS_COLLECTION, ROLES } from 'core/api/constants';

const getSchema = ({ admins = [], availableBorrowers = [] }) =>
  new SimpleSchema({
    assigneeId: {
      type: String,
      allowedValues: admins.map(({ _id }) => _id),
      uniforms: {
        transform: assigneeId =>
          admins.find(({ _id }) => _id === assigneeId).name,
        labelProps: { shrink: true },
        label: 'Conseiller',
        placeholder: null,
      },
    },
    ...(availableBorrowers?.length
      ? {
          borrowers: {
            type: Array,
            optional: true,
            defaultValue: [],
            maxCount: 2,
            uniforms: { checkboxes: true },
          },
          'borrowers.$': {
            type: String,
            allowedValues: availableBorrowers.map(({ _id }) => _id),
            optional: true,
            uniforms: {
              transform: borrowerId =>
                availableBorrowers.find(({ _id }) => _id === borrowerId).name,
            },
          },
        }
      : {}),
  });

export default withProps(({ user = {}, loan = {} }) => {
  const {
    _id: userId,
    assignedEmployee = {},
    borrowers: userBorrowers = [],
  } = user;
  const { _id: loanId, assignees = [], borrowers: loanBorrowers = [] } = loan;
  const loanMainAssignee = assignees?.find(({ isMain }) => isMain);
  const availableBorrowers = uniqBy(
    [...userBorrowers, ...loanBorrowers],
    '_id',
  );
  const { loading, data: admins } = useStaticMeteorData({
    query: USERS_COLLECTION,
    params: {
      $filters: { roles: { $in: [ROLES.ADMIN, ROLES.DEV] } },
      name: 1,
    },
    refetchOnMethodCall: false,
  });

  return {
    schema: !loading ? getSchema({ admins, availableBorrowers }) : null,
    loading,
    model: {
      assigneeId: loanMainAssignee?._id || assignedEmployee?._id,
    },
    onSubmit: ({ assigneeId, borrowers = [] }) =>
      insuranceRequestInsert.run({
        insuranceRequest: {
          borrowerLinks: borrowers.map(_id => ({ _id })),
        },
        loanId,
        userId,
        assigneeId,
      }),
  };
});
