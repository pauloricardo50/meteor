import 'react-pivottable/pivottable.css';

import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';

import Loading from 'core/components/Loading';

import AnalysisActions from './AnalysisActions';
import { useAnalysisData } from './AnalysisTabContainer';
import SavedAnalyses from './SavedAnalyses';

const PlotlyRenderers = createPlotlyRenderers(Plot);

const AnalysisTab = () => {
  const { formatMessage } = useIntl();
  const [state, setState] = useState();
  const [queuedState, setQueuedState] = useState();
  const [collection, setCollection] = useState();
  const { data, loading } = useAnalysisData({ collection, formatMessage });

  useEffect(() => {
    // The PivotTable needs to have the data before we can set the filters
    // and display options, so first wait for the data to come back, and then
    // set the report's payload to the pivotTable state
    if (!loading && queuedState) {
      setState(queuedState);
      setQueuedState();
    }
  }, [loading, queuedState]);

  return (
    <div>
      <div className="flex center-align">
        <h1 className="mr-16">Analyse</h1>
        <AnalysisActions
          state={state}
          setState={setState}
          collection={collection}
          setCollection={setCollection}
        />
      </div>

      <div className="flex sb">
        {loading ? (
          <Loading />
        ) : (
          <PivotTableUI
            data={data}
            onChange={setState}
            renderers={{ ...TableRenderers, ...PlotlyRenderers }}
            {...state}
          />
        )}
        <SavedAnalyses
          setState={setQueuedState}
          setCollection={setCollection}
        />
      </div>
    </div>
  );
};

export default AnalysisTab;
