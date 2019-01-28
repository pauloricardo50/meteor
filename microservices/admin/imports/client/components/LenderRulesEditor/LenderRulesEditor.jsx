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
  updateFilter,
}: LenderRulesEditorProps) => {
  console.log('lenderRules:', lenderRules);
  if (!lenderRules) {
    return (
      <Button raised primary onClick={addLenderRules}>
        Ajouter règles et critères d'octroi
      </Button>
    );
  }

  return (
    <div>
      <LenderRulesEditorMath
        lenderRules={lenderRules}
        updateMath={updateMath}
      />
      {lenderRules.filters.map(filterObject => (
        <LenderRulesEditorFilter
          key={filterObject.id}
          filterObject={filterObject}
          updateFilter={updateFilter}
        />
      ))}
    </div>
  );
};

export default LenderRulesEditorContainer(LenderRulesEditor);
