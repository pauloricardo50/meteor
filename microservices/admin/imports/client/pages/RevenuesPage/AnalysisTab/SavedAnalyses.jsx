// @flow
import React from 'react';

import { useStaticMeteorData } from 'core/hooks/useMeteorData';

type SavedAnalysesProps = {};

const SavedAnalyses = ({ setState }: SavedAnalysesProps) => {
  const { data, loading } = useStaticMeteorData({ query: 'ANALYSIS_REPORTS' });

  return (
    <div className="flex-col" style={{ width: 300 }}>
      <h3>Rapports enregistrés</h3>
      <hr />
    </div>
  );
};

export default SavedAnalyses;
