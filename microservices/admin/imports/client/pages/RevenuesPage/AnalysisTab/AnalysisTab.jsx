// @flow
import React, { useState } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { injectIntl } from 'react-intl';

import Loading from 'core/components/Loading';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { useAnalysisData } from './AnalysisTabContainer';
import SavedAnalyses from './SavedAnalyses';
import { analysisCollections } from './analysisHelpers';

type AnalysisTabProps = {};

const PlotlyRenderers = createPlotlyRenderers(Plot);

const AnalysisTab = ({ intl: { formatMessage } }: AnalysisTabProps) => {
  const [state, setState] = useState();
  const [collection, setCollection] = useState();
  const { data, loading } = useAnalysisData({ collection, formatMessage });

  return (
    <div>
      <div className="flex center-align">
        <h1 className="mr-16">Analyse</h1>
        <Select
          value={collection}
          options={analysisCollections.map(v => ({
            id: v,
            label: <T id={`collections.${v}`} />,
          }))}
          onChange={setCollection}
          className="mr-16"
        />
        <Button raised primary onClick={() => setState()}>
          Reset
        </Button>
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
        <SavedAnalyses setState={setState} />
      </div>
    </div>
  );
};

export default injectIntl(AnalysisTab);
