//      
import React from 'react';

import Button from 'core/components/Button';
import LenderRulesEditorContainer from './LenderRulesEditorContainer';
import LenderRulesEditorSingle from './LenderRulesEditorSingle';
import LenderRulesSorter from './LenderRulesSorter/LenderRulesSorter';
import LenderRulesAdder from './LenderRulesForm/LenderRulesAdder';

                                 

const LenderRulesEditor = ({
  initializeLenderRules,
  lenderRules,
  makeUpdateLenderRules,
  organisationId,
}                        ) => {
  if (!lenderRules || lenderRules.length === 0) {
    return (
      <Button raised primary onClick={initializeLenderRules}>
        Ajouter règles et critères d'octroi
      </Button>
    );
  }

  return (
    <div className="lender-rules-editor">
      <LenderRulesSorter lenderRules={lenderRules} />
      {lenderRules
        .sort(({ order: orderA }, { order: orderB }) => orderA - orderB)
        .map(lenderRulesObject => (
          <LenderRulesEditorSingle
            key={lenderRulesObject._id}
            lenderRules={lenderRulesObject}
            updateLenderRules={makeUpdateLenderRules(lenderRulesObject._id)}
          />
        ))}
      <LenderRulesAdder organisationId={organisationId} />
    </div>
  );
};

export default LenderRulesEditorContainer(LenderRulesEditor);
