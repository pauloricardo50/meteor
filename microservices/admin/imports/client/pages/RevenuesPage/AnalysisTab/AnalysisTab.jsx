
import React, { useState, useEffect } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { injectIntl } from 'react-intl';

import Loading from 'core/components/Loading';

import { useAnalysisData } from './AnalysisTabContainer';
import SavedAnalyses from './SavedAnalyses';
import AnalysisActions from './AnalysisActions';

const PlotlyRenderers = createPlotlyRenderers(Plot);

const AnalysisTab = ({ intl: { formatMessage } }) => {
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
        {!loading ? (
          <PivotTableUI
            data={data}
            onChange={setState}
            renderers={{ ...TableRenderers, ...PlotlyRenderers }}
            {...state}
          />
        ) : (
          <Loading />
        )}
        <SavedAnalyses
          setState={setQueuedState}
          setCollection={setCollection}
        />
      </div>
    </div>
  );
};

export default injectIntl(AnalysisTab);
