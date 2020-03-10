import React, { useContext } from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import uniqBy from 'lodash/uniqBy';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';
import { insuranceRequestInsert } from 'core/api/insuranceRequests/methodDefinitions';
import { USERS_COLLECTION, ROLES } from 'core/api/constants';
import { ModalManagerContext } from 'core/components/ModalManager';
import InsuranceRequestAdderNameSetter from './InsuranceRequestAdderNameSetter';

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
          borrowerIds: {
            type: Array,
            optional: true,
            defaultValue: [],
            maxCount: 2,
            uniforms: { checkboxes: true, label: 'Assurés' },
          },
          'borrowerIds.$': {
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
  const { openModal } = useContext(ModalManagerContext);

  const {
    _id: userId,
    assignedEmployee = {},
    borrowers: userBorrowers = [],
  } = user;

  const {
    _id: loanId,
    assignees = [],
    borrowers: loanBorrowers = [],
    name: loanName,
    insuranceRequests = [],
  } = loan;

  const loanMainAssignee = assignees?.find(
    ({ $metadata: { isMain } = {} }) => isMain,
  );

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
    onSubmit: ({ assigneeId, borrowerIds = [] }) =>
      insuranceRequestInsert
        .run({
          loanId,
          userId,
          assigneeId,
          borrowerIds,
        })
        .then(({ name: insuranceRequestName, _id: insuranceRequestId }) => {
          if (loanId && !insuranceRequests.length) {
            openModal([
              {
                title: 'Numéro du dossier assurance',
                description: `Vous avez lié un dossier assurance au dossier hypothécaire "${loanName}". Veuillez choisir un numéro pour ce dossier assurance. Attention: si vous conservez le numéro courant, le numéro du dossier hypothécaire sera modifié à "${insuranceRequestName
                  .split('-')
                  .slice(0, 2)
                  .join('-')}"`,
                content: ({ closeModal }) => (
                  <InsuranceRequestAdderNameSetter
                    closeModal={closeModal}
                    insuranceRequestId={insuranceRequestId}
                    insuranceRequestName={insuranceRequestName}
                    loanId={loanId}
                    loanName={loanName}
                  />
                ),
                actions: [],
                important: true,
              },
            ]);
          }
        }),
  };
});
