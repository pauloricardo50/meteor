// @flow
import { Meteor } from 'meteor/meteor';

import React, { useState, useEffect } from 'react';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import 'react-pivottable/pivottable.css';
import TableRenderers from 'react-pivottable/TableRenderers';
import Plot from 'react-plotly.js';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { injectIntl } from 'react-intl';
import omit from 'lodash/omit';
import SimpleSchema from 'simpl-schema';

import Loading from 'core/components/Loading';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { useAnalysisData } from './AnalysisTabContainer';
import SavedAnalyses from './SavedAnalyses';
import { analysisCollections } from './analysisHelpers';

type AnalysisTabProps = {};

const PlotlyRenderers = createPlotlyRenderers(Plot);

const schema = new SimpleSchema({ name: String });

const AnalysisTab = ({ intl: { formatMessage } }: AnalysisTabProps) => {
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
        <Select
          value={collection}
          options={analysisCollections.map(v => ({
            id: v,
            label: <T id={`collections.${v}`} />,
          }))}
          onChange={newValue => {
            setCollection(newValue);
            // Reset all pivotTable state on collection change
            setState();
          }}
          className="mr-16"
        />
        <Button raised primary onClick={() => setState()} className="mr-16">
          Reset
        </Button>
        <AutoFormDialog
          buttonProps={{
            label: 'Enregistrer rapport',
            raised: true,
            primary: true,
          }}
          schema={schema}
          title="Enregistrer rapport"
          onSubmit={({ name }) =>
            new Promise((resolve, reject) => {
              Meteor.call(
                'insertAnalysisReport',
                {
                  name,
                  payload: {
                    ...omit(state, [
                      'data',
                      'renderers',
                      'onChange',
                      'tableColorScaleGenerator',
                    ]),
                    collection,
                  },
                },
                (error, result) => (error ? reject(error) : resolve(result)),
              );
            })
          }
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
