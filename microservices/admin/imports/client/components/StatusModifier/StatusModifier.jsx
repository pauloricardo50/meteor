import React, { useContext } from 'react';
import { withProps } from 'recompose';

import Button from 'core/components/Button';
import { ModalManagerContext } from 'core/components/ModalManager';
import StatusLabel from 'core/components/StatusLabel/StatusLabel';
import T from 'core/components/Translation';

const Title = ({ status }) => (
  <span>
    Passage du dossier à&nbsp;&quot;
    <T id={`Forms.status.${status}`} />
    &quot;
  </span>
);

export const CancelButton = ({ reject, closeAll }) => (
  <Button
    primary
    label={<T id="general.cancel" />}
    onClick={() => {
      reject();
      closeAll();
    }}
  />
);

export const makeAdditionalActions = ({
  doc,
  additionalActionsConfig,
  openModal,
}) => (status, prevStatus) =>
  new Promise((resolve, reject) => {
    const { DEFAULT, ...callbacks } = additionalActionsConfig;
    let callback = DEFAULT;

    // Get right callback for status
    Object.keys(callbacks).some(s => {
      if (s === status) {
        callback = callbacks[s];
        return true;
      }

      return false;
    });

    if (callback) {
      const { bypass, modals, func } = callback({
        resolve,
        reject,
        doc,
        status,
        prevStatus,
      });

      // Callback should be bypassed
      if (bypass) {
        return resolve();
      }

      // Callback is a func
      if (func) {
        return func();
      }

      // Callback uses modal manager
      return openModal(
        modals.map(modal => {
          if (React.isValidElement(modal)) {
            const { props: { actions } = {} } = modal;

            return React.cloneElement(modal, {
              title: <Title status={status} />,
              actions:
                actions ||
                (({ closeAll }) => (
                  <CancelButton
                    reject={reject}
                    closeAll={closeAll}
                    key="cancel"
                  />
                )),
            });
          }

          return {
            title: <Title status={status} />,
            actions: ({ closeAll }) => (
              <CancelButton reject={reject} closeAll={closeAll} />
            ),
            ...modal,
          };
        }),
      );
    }

    return resolve();
  });

const StatusModifier = ({
  collection,
  status,
  docId,
  additionalActions,
  method,
  ...props
}) => (
  <StatusLabel
    collection={collection}
    status={status}
    allowModify
    docId={docId}
    additionalActions={additionalActions}
    method={method}
    {...props}
  />
);

export default withProps(({ doc, collection, additionalActionsConfig }) => {
  const { openModal } = useContext(ModalManagerContext);

  return {
    collection: doc?._collection || collection,
    status: doc?.status,
    docId: doc?._id,
    additionalActions:
      additionalActionsConfig &&
      makeAdditionalActions({ doc, openModal, additionalActionsConfig }),
  };
})(StatusModifier);
