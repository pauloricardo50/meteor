import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckIcon from '@material-ui/icons/Check';
import SimpleSchema from 'simpl-schema';
import { BaseField, filterDOMProps } from 'uniforms';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoField, AutoForm } from 'uniforms-material';

import FormattedMessage from 'core/components/Translation/FormattedMessage';
import useMedia from 'core/hooks/useMedia';

import { callMethod } from '../../utils/meteorClient';
import Button from '../Button';

const SubmitField = (
  { children, disabled, inputRef, label, value, ...props },
  { uniforms: { error, state } },
) => (
  <Button
    disabled={disabled === undefined ? !!(error || state.disabled) : disabled}
    ref={inputRef}
    type="submit"
    value={value}
    raised
    primary
    {...filterDOMProps(props)}
  >
    {children || label}
  </Button>
);

SubmitField.contextTypes = BaseField.contextTypes;
SubmitField.defaultProps = {
  label: <FormattedMessage id="submit" />,
  variant: 'contained',
};

const schema = new SimpleSchema2Bridge(
  new SimpleSchema({
    name: {
      type: String,
      uniforms: { label: <FormattedMessage id="promoInterest.form.name" /> },
    },
    email: {
      type: String,
      regEx: SimpleSchema.RegEx.email,
      label: <FormattedMessage id="promoInterest.form.email" />,
    },
    phoneNumber: {
      type: String,
      optional: true,
      uniforms: {
        label: <FormattedMessage id="promoInterest.form.phoneNumber" />,
      },
    },
    details: {
      type: String,
      optional: true,
      uniforms: {
        label: <FormattedMessage id="promoInterest.form.details" />,
        multiline: true,
        rows: 5,
        rowsMax: 15,
      },
    },
  }),
);

const PromotionInterestForm = ({ promotion }) => {
  const isMobile = useMedia({ maxWidth: 768 });
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  return (
    <div className="promotion-item-interest-button">
      <Button
        raised={!interestSent}
        outlined={interestSent}
        primary
        className="button ml-8"
        onClick={() => setOpenModal(s => !s)}
        disabled={interestSent}
        size="small"
        icon={interestSent && <CheckIcon />}
        iconAfter
      >
        <FormattedMessage id="promoInterest" values={{ sent: interestSent }} />
      </Button>

      <Dialog
        open={openModal}
        onBackdropClick={() => setOpenModal(false)}
        fullScreen={isMobile}
      >
        <DialogTitle>
          <FormattedMessage
            id="promoInterest.title"
            values={{ promotionName: promotion.name }}
          />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormattedMessage id="promoInterest.description" />
          </DialogContentText>
          <AutoForm
            schema={schema}
            onSubmit={({ name, email, phoneNumber, details }) => {
              setSubmitting(true);
              callMethod('submitPromotionInterestForm', {
                name,
                email,
                phoneNumber,
                details,
                promotionId: promotion._id,
              })
                .then(() => {
                  setInterestSent(true);
                  setOpenModal(false);
                })
                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            <AutoField name="name" />
            <AutoField name="email" />
            <AutoField name="phoneNumber" />
            <AutoField name="details" />
            <DialogActions style={{ marginRight: '-16px' }}>
              <Button
                outlined
                primary
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <SubmitField disabled={submitting === true} />
            </DialogActions>
          </AutoForm>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionInterestForm;
