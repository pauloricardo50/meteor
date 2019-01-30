// @flow
import React from 'react';

import Button from 'core/components/Button';
import LenderRulesEditorContainer from './LenderRulesEditorContainer';
import LenderRulesEditorSingle from './LenderRulesEditorSingle';
import LenderRulesAdder from './LenderRulesForm/LenderRulesAdder';

type LenderRulesEditorProps = {};

const LenderRulesEditor = ({
  initializeLenderRules,
  lenderRules,
  makeUpdateLenderRules,
}: LenderRulesEditorProps) => {
  if (!lenderRules || lenderRules.length === 0) {
    return (
      <Button raised primary onClick={initializeLenderRules}>
        Ajouter règles et critères d'octroi
      </Button>
    );
  }

  return (
    <div className="lender-rules-editor">
      {lenderRules.map(lenderRulesObject => (
        <LenderRulesEditorSingle
          key={lenderRulesObject._id}
          lenderRules={lenderRulesObject}
          updateLenderRules={makeUpdateLenderRules(lenderRulesObject._id)}
        />
      ))}
      <LenderRulesAdder />
    </div>
  );
};

export default LenderRulesEditorContainer(LenderRulesEditor);
