// @flow
import React, { useState } from 'react';
import moment from 'moment';
import cx from 'classnames';

import { employeesById } from 'core/arrays/epotekEmployees';
import AdminNoteAdder from 'core/components/AdminNote/AdminNoteAdder';
import Button from 'core/components/Button';

type LoanAdminNotesProps = {};

const LoanAdminNotes = ({
  loan: { _id: loanId, adminNotes, proNote },
}: LoanAdminNotesProps) => {
  const [showAll, setShowAll] = useState(false);
  const shownNotes = adminNotes.slice(0, showAll ? undefined : 2);
  const shouldShowProNote =
    proNote && proNote.id && !shownNotes.find(({ id }) => id === proNote.id);

  return (
    <div className="admin-notes">
      <div className="flex center-align mb-16">
        <h2 className="mr-8">Notes</h2>
        <AdminNoteAdder
          loanId={loanId}
          buttonProps={{
            raised: true,
            primary: true,
            label: 'Ajouter une note',
          }}
        />
      </div>

      {shouldShowProNote && (
        <div className="card1 card-top pro-note mb-16">
          <div className="primary">Dernière note Pro</div>
          <div className="note">{proNote.note}</div>
        </div>
      )}

      <div className="flex-col">
        {shownNotes.map(adminNote => {
          const { note, id, date, updatedBy, isSharedWithPros } = adminNote;
          const { name, src } = employeesById[updatedBy] || {};

          return (
            <div
              key={id}
              className={cx('mb-16 admin-notes-note', {
                shared: isSharedWithPros,
              })}
            >
              <div className="flex center-align mb-8">
                {src && (
                  <img
                    src={src}
                    alt={name}
                    style={{ borderRadius: '50%', width: 20, height: 20 }}
                    className="mr-8"
                  />
                )}
                <span className="secondary mr-8">
                  {moment(date).format('D/M/YY')}
                </span>
                <AdminNoteAdder
                  loanId={loanId}
                  buttonProps={{
                    label: 'Modifier',
                    size: 'small',
                    className: 'mr-8',
                  }}
                  adminNote={adminNote}
                />
                {isSharedWithPros && (
                  <span className="primary">Partagé avec les pros!</span>
                )}
              </div>
              {note}
            </div>
          );
        })}
      </div>

      {adminNotes.length > 2 && (
        <Button primary onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Masquer' : 'Afficher tout'}
        </Button>
      )}
    </div>
  );
};

export default LoanAdminNotes;
