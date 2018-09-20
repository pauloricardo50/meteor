// @flow
import React from 'react';

import DialogForm from '../Form/DialogForm';
import Button from '../Button';
import AdditionalDocAdderContainer from './AdditionalDocAdderContainer';

type AdditionalDocAdderProps = {};

const formArray = [
  {
    id: 'label',
    label: 'Nom du document supplémentaire',
    placeholder: "p.ex. Annexes déclaration d'impôts",
  },
];

const AdditionalDocAdder = ({ onSubmit }: AdditionalDocAdderProps) => (
  <DialogForm
    form="add-additional-doc"
    onSubmit={onSubmit}
    button={(
      <Button raised primary className="additional-doc-adder">
        Demander document supplémentaire
      </Button>
    )}
    title="Demander document supplémentaire"
    formArray={formArray}
  />
);

export default AdditionalDocAdderContainer(AdditionalDocAdder);
