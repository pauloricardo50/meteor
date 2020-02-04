import React from 'react';

const { Front } = window;

const FrontContactLoans = ({ loans = [] }) => (
  <div>
    <h4>Dossiers</h4>

    {loans.length === 0 && (
      <div className="text-center">
        <i>Pas de dossiers</i>
      </div>
    )}

    {loans.map(({ _id, name }) => (
      <div key={_id}>
        <h3
          style={{ marginTop: 0 }}
          className="link"
          onClick={() => {
            Front.openUrl(`https://admin.e-potek.ch/loans/${_id}`);
          }}
        >
          {name}
        </h3>
      </div>
    ))}
  </div>
);

export default FrontContactLoans;
