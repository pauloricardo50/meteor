// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import omit from 'lodash/omit';
import SimpleSchema from 'simpl-schema';

import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Select from 'core/components/Select';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { analysisCollections } from './analysisHelpers';

type AnalysisActionsProps = {};

const schema = new SimpleSchema({ name: String });

const AnalysisActions = ({
  state,
  setState,
  collection,
  setCollection,
}: AnalysisActionsProps) => (
  <>
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
  </>
);

export default AnalysisActions;
