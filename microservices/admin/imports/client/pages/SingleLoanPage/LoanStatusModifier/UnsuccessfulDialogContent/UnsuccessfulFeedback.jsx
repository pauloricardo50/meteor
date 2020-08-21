import React, { useMemo, useState } from 'react';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons/faEnvelope';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmMethod from 'imports/core/components/ConfirmMethod';
import uniqBy from 'lodash/uniqBy';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { sendNegativeFeedbackToLenders } from 'core/api/loans/methodDefinitions';
import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import Button from 'core/components/Button';
import Calculator from 'core/utils/Calculator';

import DialogContentSection from '../DialogContentSection';

const makeSchema = contacts =>
  new SimpleSchema({
    contactIds: {
      type: Array,
      minCount: 1,
      uniforms: {
        checkboxes: true,
        label: 'Prêteurs',
        initialValue: [],
        options: contacts,
        allowClear: true,
      },
    },
    'contactIds.$': {
      type: String,
    },
  });

const makeOnSubmit = ({ setOpenConfirmDialog, setContactIds }) => ({
  contactIds,
}) => {
  setContactIds(contactIds);
  setOpenConfirmDialog(true);

  return Promise.resolve();
};

const UnsucessfulFeedback = ({
  onSubmit,
  closeModal,
  returnValue,
  enableFeedbackButton,
  schema,
  openConfirmDialog,
  setOpenConfirmDialog,
  contactIds,
  selectedContacts,
  loan,
}) => (
  <div className="loan-status-modifier-dialog-content animated fadeIn">
    <DialogContentSection
      title="Envoyer un feedback aux prêteurs"
      description='Envoie un feedback "négatif sans suite" aux prêteurs que vous sélectionnez.'
      buttons={[
        <AutoFormDialog
          key="sendFeedback"
          title="Envoyer un feedback aux prêteurs"
          description="Sélectionnez les prêteurs à qui envoyer le feedback"
          schema={schema}
          model={{ contactIds: [] }}
          onSubmit={onSubmit}
          buttonProps={{
            primary: true,
            outlined: true,
            icon: <FontAwesomeIcon icon={faEnvelope} />,
            label: 'Envoyer un feedback',
            disabled: !enableFeedbackButton,
            tooltip: !enableFeedbackButton && 'Aucune offre sur ce dossier',
          }}
        />,
        <Button
          error
          outlined
          label="Ne pas envoyer de feedback"
          onClick={() => closeModal({ ...returnValue })}
          key="dontSendFeedback"
        />,
      ]}
      styles={{ buttons: { width: '100%' } }}
    >
      <ConfirmMethod
        method={() =>
          sendNegativeFeedbackToLenders
            .run({ loanId: loan._id, contactIds })
            .then(() => {
              setOpenConfirmDialog(false);
              return closeModal({ ...returnValue });
            })
        }
        type="modal"
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        description={
          <div className="flex-col">
            <p className="description">
              Attention! Enverra un feedback aux prêteurs suivants:
            </p>
            <ul>
              {selectedContacts.map(({ label, value }) => (
                <li key={value}>{label}</li>
              ))}
            </ul>
          </div>
        }
      />
    </DialogContentSection>
  </div>
);

export default withProps(({ loan }) => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [contactIds, setContactIds] = useState();

  const lendersWithOffers = loan?.lenders?.filter(
    ({ offers = [] }) => offers.length,
  );

  const contacts = uniqBy(
    lendersWithOffers,
    ({ contact: { name } }) => name,
  ).map(
    ({ contact: { name, _id }, organisation: { name: organisationName } }) => ({
      value: _id,
      label: `${name} (${organisationName})`,
    }),
  );

  const selectedContacts = contacts.filter(({ value }) =>
    contactIds?.includes(value),
  );

  const schema = useMemo(() => makeSchema(contacts), [contacts]);

  return {
    schema,
    onSubmit: makeOnSubmit({
      setOpenConfirmDialog,
      setContactIds,
    }),
    enableFeedbackButton: Calculator.selectOffers({ loan }).length,
    openConfirmDialog,
    setOpenConfirmDialog,
    contactIds,
    setContactIds,
    selectedContacts,
  };
})(UnsucessfulFeedback);
