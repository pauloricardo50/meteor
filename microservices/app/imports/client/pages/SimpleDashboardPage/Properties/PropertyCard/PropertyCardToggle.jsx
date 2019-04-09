// @flow
import React from 'react';
import { withProps, compose, withState } from 'recompose';

import Toggle from 'core/components/Toggle';
import { PROPERTY_CATEGORY } from 'core/api/constants';
import { loanShareSolvency } from 'core/api/methods/index';
import Dialog from 'core/components/Material/Dialog';
import T from 'core/components/Translation';
import Button from 'core/components/Button';

type PropertyCardToggleProps = {};

const PropertyCardToggle = ({
  category,
  handleToggle,
  setOpenDialog,
  openDialog,
  loading,
  handleSubmit,
  shareSolvency,
}: PropertyCardToggleProps) => {
  if (category !== PROPERTY_CATEGORY.PRO) {
    return null;
  }

  return (
    <>
      <Toggle
        onToggle={handleToggle}
        toggled={shareSolvency}
        labelLeft="Activer partage de solvabilité"
      />
      <Dialog
        open={openDialog}
        title={<T id="SimpleDashboardPage.shareSolvency.title" />}
        text={<T id="SimpleDashboardPage.shareSolvency.disclaimer" />}
        actions={[
          <Button
            label={<T id="ConfirmMethod.buttonCancel" />}
            primary
            onClick={() => setOpenDialog(false)}
            key="cancel"
            disabled={loading}
          />,
          <Button
            label={<T id="ConfirmMethod.buttonConfirm" />}
            primary
            onClick={handleSubmit}
            key="ok"
            loading={loading}
          />,
        ]}
      />
    </>
  );
};

export default compose(
  withState('openDialog', 'setOpenDialog', false),
  withState('loading', 'setLoading', false),
  withProps(({ loanId, setOpenDialog, shareSolvency, setLoading }) => ({
    handleToggle: () => {
      if (!shareSolvency) {
        setOpenDialog(true);
      } else {
        loanShareSolvency.run({ loanId, shareSolvency: false });
      }
    },
    toggled: shareSolvency,
    handleSubmit: () => {
      setLoading(true);
      loanShareSolvency
        .run({ loanId, shareSolvency: true })
        .then(() => {
          setOpenDialog(false);
        })
        .finally(() => setLoading(false));
    },
  })),
)(PropertyCardToggle);
