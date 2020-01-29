// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import moment from 'moment';
import { aggregators } from 'react-pivottable/Utilities';

import { useReactiveMeteorData } from 'core/hooks/useMeteorData';
import ConfirmMethod from 'core/components/ConfirmMethod';

type SavedAnalysesProps = {};

const SavedAnalyses = ({ setState, setCollection }: SavedAnalysesProps) => {
  const { data = [], loading } = useReactiveMeteorData({
    query: 'analysisReports',
    params: { name: 1, user: { firstName: 1 }, createdAt: 1, payload: 1 },
  });

  return (
    <div className="flex-col" style={{ width: 300 }}>
      <h3>Rapports enregistrés</h3>
      <hr />
      <div className="flex-col">
        {!loading &&
          data.map(
            ({
              name,
              user,
              createdAt,
              _id,
              payload: { collection, ...state },
            }) => (
              <div
                key={_id}
                className="card1 card-top card-hover mb-8"
                onClick={() => {
                  setCollection(collection);
                  setState({ ...state, aggregators });
                }}
              >
                <div className="flex sb">
                  <h4>{name}</h4>
                  <ConfirmMethod
                    label="Supprimer"
                    method={() =>
                      new Promise((res, rej) =>
                        Meteor.call('removeAnalysisReport', { _id }, err =>
                          err ? rej(err) : res(),
                        ),
                      )
                    }
                  />
                </div>
                <span>
                  Créé le {moment(createdAt).format('D/M/YYYY')} par{' '}
                  {user ? user.firstName : 'Anonyme'}
                </span>
              </div>
            ),
          )}
      </div>
    </div>
  );
};

export default SavedAnalyses;
