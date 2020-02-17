import React from 'react';

const FrontError = ({ error }) => (
  <div
    className="flex-col center animated jackInTheBox"
    style={{ padding: 16 }}
  >
    <h2 className="error">Woops une erreur!</h2>
    <div className="description">
      <p>
        Quelque chose n'a pas fonctionné comme prévu, on en est déjà informés.
      </p>
    </div>
    <div className="error" style={{ margin: 40 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        <h4>{error?.name}</h4>:
        <h3 style={{ marginLeft: 16 }}>{error?.message}</h3>
      </span>
      {error?.stack}
    </div>
  </div>
);

export default FrontError;
