import { Meteor } from 'meteor/meteor';

import React, { useState, useContext } from 'react';
import moment from 'moment';
import { aggregators } from 'react-pivottable/Utilities';
import SimpleSchema from 'simpl-schema';

import { useReactiveMeteorData } from 'core/hooks/useMeteorData';
import ConfirmMethod from 'core/components/ConfirmMethod';
import TextInput from 'core/components/TextInput';
import IconButton from 'core/components/IconButton';
import RadioTabs from 'core/components/RadioButtons/RadioTabs';
import { generateMatchAllWordsRegexp } from 'core/api/helpers/mongoHelpers';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { CurrentUserContext } from 'core/containers/CurrentUserContext';

const schema = new SimpleSchema({ name: String });

const SavedAnalysis = ({ setCollection, setState, report }) => {
  const {
    name,
    user,
    createdAt,
    _id,
    payload: { collection, ...state },
  } = report;

  return (
    <div
      key={_id}
      className="card1 card-top card-hover mb-8"
      onClick={() => {
        setCollection(collection);
        setState({ ...state, aggregators });
      }}
    >
      <div className="flex sb center-align">
        <h4 style={{ marginTop: 0 }}>{name}</h4>
        <div className="flex">
          <ConfirmMethod
            label="Supprimer"
            method={() =>
              new Promise((res, rej) =>
                Meteor.call('removeAnalysisReport', { _id }, err =>
                  err ? rej(err) : res(),
                ),
              )
            }
            TriggerComponent={IconButton}
            buttonProps={{
              type: 'close',
              size: 'small',
              tooltip: 'Supprimer',
              color: 'error',
              className: 'mr-8',
            }}
          />
          <AutoFormDialog
            schema={schema}
            model={report}
            onSubmit={values =>
              new Promise((resolve, reject) => {
                Meteor.call('updateAnalysisReport', values, (error, result) =>
                  error ? reject(error) : resolve(result),
                );
              })
            }
            triggerComponent={handleOpen => (
              <IconButton
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleOpen();
                }}
                type="edit"
                size="small"
                tooltip="Modifier nom"
              />
            )}
          />
        </div>
      </div>
      <span>
        Créé le {moment(createdAt).format('D/M/YYYY')} par{' '}
        {user ? user.firstName : 'Anonyme'}
      </span>
    </div>
  );
};

const SavedAnalyses = ({ setState, setCollection }) => {
  const currentUser = useContext(CurrentUserContext);
  const [search, setSearch] = useState('');
  const [myReports, setMyReports] = useState(true);
  const { data = [], loading } = useReactiveMeteorData(
    {
      query: 'analysisReports',
      params: {
        $filters: {
          name: {
            $regex: generateMatchAllWordsRegexp(search.split(' ')),
            $options: 'g',
          },
          ...(myReports ? { 'userLink._id': currentUser._id } : undefined),
        },
        $options: { sort: { createdAt: -1 } },
        name: 1,
        user: { firstName: 1 },
        createdAt: 1,
        payload: 1,
      },
    },
    [search, myReports, currentUser._id],
  );

  return (
    <div className="flex-col" style={{ width: 300 }}>
      <h3 style={{ margin: 0 }}>Rapports enregistrés</h3>
      <hr style={{ width: '100%', margin: '16px 0' }} />
      <TextInput
        label="Chercher"
        value={search}
        onChange={setSearch}
        className="mb-8"
      />

      <RadioTabs
        options={[
          { id: true, label: 'Mes rapports' },
          { id: false, label: 'Tous' },
        ]}
        onChange={setMyReports}
        value={myReports}
        className="mb-8"
      />

      <div className="flex-col">
        {!loading &&
          data.map(report => (
            <SavedAnalysis
              key={report._id}
              report={report}
              setState={setState}
              setCollection={setCollection}
            />
          ))}
      </div>
    </div>
  );
};

export default SavedAnalyses;
