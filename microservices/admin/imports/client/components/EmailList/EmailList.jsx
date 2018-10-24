// @flow
import React from 'react';
import moment from 'moment';

import query from 'core/api/users/queries/userEmails';
import Table from 'core/components/Table';
import { withSmartQuery } from 'imports/core/api/containerToolkit/index';

type EmailListProps = {};

const EmailList = ({ user: { sentEmails } }: EmailListProps) => (
  <div style={{ marginTop: 40 }}>
    <h3>Emails automatiques envoyés</h3>
    <p>Attention, pas toujours à jour si envoyé il y a longtemps</p>

    {Array.isArray(sentEmails) ? (
      <Table
        rows={sentEmails.map(({ clicks, opens, state, ts, subject, _id }) => ({
          id: _id,
          columns: [subject, moment(ts * 1000).fromNow(), state, opens, clicks],
        }))}
        columnOptions={[
          { id: 'Nom du mail' },
          { id: 'Date' },
          { id: 'Statut' },
          { id: 'Nb. fois ouvert' },
          { id: 'Nb. fois cliqué' },
        ]}
        clickable={false}
        noIntl
      />
    ) : (
      <p className="error">
        Erreur avec les emails... Vas l'annoncer à Florian, qui sera ravi.
      </p>
    )}
  </div>
);

export default withSmartQuery({
  query: ({ userId }) => query.clone({ userId }),
  queryOptions: { single: true },
  dataName: 'user',
})(EmailList);
