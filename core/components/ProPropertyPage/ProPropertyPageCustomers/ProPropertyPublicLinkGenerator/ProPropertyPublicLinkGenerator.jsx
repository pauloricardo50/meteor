//
import React, { useContext } from 'react';

import { ModalManagerContext } from 'core/components/ModalManager';
import DialogForm from 'core/components/ModalManager/DialogForm';
import T from 'core/components/Translation';
import Button from 'core/components/Button';
import ProPropertyPublicLinkGeneratorContainer from './ProPropertyPublicLinkGeneratorContainer';
import PublicLink from './PublicLink';

const ProPropertyPublicLinkGenerator = ({
  schema,
  generatePublicLink,
  makeDescription,
}) => {
  const { openModal } = useContext(ModalManagerContext);

  return (
    <Button
      onClick={() =>
        openModal([
          <DialogForm
            key="reason"
            schema={schema}
            title="Obtenir le lien public"
            description="Sélectionnez le referral"
            className="animated fadeIn"
            important
          />,
          {
            title: 'Obtenir le lien public',
            description: ({ returnValue: { ref } }) => makeDescription(ref),
            content: ({ returnValue: { ref } }) => (
              <PublicLink link={generatePublicLink(ref)} />
            ),
            maxWidth: 'lg',
          },
        ])
      }
      primary
      raised
      label="Obtenir le lien public"
      className="ml-16"
    />
  );
};

export default ProPropertyPublicLinkGeneratorContainer(
  ProPropertyPublicLinkGenerator,
);
