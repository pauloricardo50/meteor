// @flow
import React from 'react';
import Button from 'imports/core/components/Button/Button';
import LenderRulesEditorContainer from './LenderRulesEditorContainer';

type LenderRulesEditorProps = {};

const LenderRulesEditor = ({
  lenderRules,
  addLenderRules,
}: LenderRulesEditorProps) => {
  if (!lenderRules) {
    return (
      <Button raised primary onClick={addLenderRules}>
        Ajouter règles
      </Button>
    );
  }

  return <div>Hello from LenderRulesEditor</div>;
};

export default LenderRulesEditorContainer(LenderRulesEditor);
