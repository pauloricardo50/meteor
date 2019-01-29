// @flow
import React from 'react';
import Button from 'imports/core/components/Button/Button';
import LenderRulesEditorContainer from './LenderRulesEditorContainer';
import LenderRulesEditorMath from './LenderRulesEditorMath';
import LenderRulesEditorFilter from './LenderRulesEditorFilter';

type LenderRulesEditorProps = {};

const LenderRulesEditor = ({
  lenderRules,
  addLenderRules,
  updateMath,
  makeUpdateFilter,
}: LenderRulesEditorProps) => {
  if (!lenderRules) {
    return (
      <Button raised primary onClick={addLenderRules}>
        Ajouter règles et critères d'octroi
      </Button>
    );
  }

  return (
    <div className="lender-rules-editor">
      <LenderRulesEditorMath
        lenderRules={lenderRules}
        updateMath={updateMath}
      />
      {lenderRules.filters.map(filterObject => (
        <LenderRulesEditorFilter
          key={filterObject.id}
          filterObject={filterObject}
          updateFilter={makeUpdateFilter(filterObject.id)}
        />
      ))}
    </div>
  );
};

export default LenderRulesEditorContainer(LenderRulesEditor);
