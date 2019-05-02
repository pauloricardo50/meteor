// @flow
import React from 'react';
import moment from 'moment';
import { compose } from 'recompose';

import userEmails from 'core/api/users/queries/userEmails';
import { withSmartQuery } from 'core/api/containerToolkit';
import withHider from 'core/containers/withHider';
import Table from 'core/components/Table';

type EmailListProps = {};

const EmailList = ({ user: { sentEmails } }: EmailListProps) => (
  <div style={{ marginTop: 40 }}>
    <h3>Emails automatiques envoyés</h3>
    <p>Seulement pendant les 30 derniers jours. Peut prendre 10-30 secondes.</p>

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

export default compose(
  withHider({ raised: true, primary: true, label: 'Afficher emails' }),
  withSmartQuery({
    query: userEmails,
    params: ({ userId }) => ({ _id: userId }),
    queryOptions: { single: true },
    dataName: 'user',
  }),
)(EmailList);
