import React from 'react';
import StatusLabel from '../core/components/StatusLabel';
import { LOANS_COLLECTION } from '../core/api/loans/loanConstants';

const { Front } = window;

const FrontContactLoans = ({ loans = [] }) => (
  <div>
    <h4>Dossiers</h4>

    {loans.length === 0 && (
      <div className="text-center">
        <i>Pas de dossiers</i>
      </div>
    )}

    {loans.map(({ _id, name, status }) => (
      <div key={_id}>
        <div className="flex center-align mb-8">
          <h3
            style={{ margin: 0, marginRight: 8 }}
            className="link"
            onClick={() => {
              Front.openUrl(`https://admin.e-potek.ch/loans/${_id}`);
            }}
          >
            {name}
          </h3>
          <StatusLabel status={status} collection={LOANS_COLLECTION} />
        </div>
      </div>
    ))}
  </div>
);

export default FrontContactLoans;
