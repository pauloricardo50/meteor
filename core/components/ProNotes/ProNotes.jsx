// @flow
import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import moment from 'moment';
import cx from 'classnames';

import { employeesById } from '../../arrays/epotekEmployees';
import AdminNoteAdder from '../AdminNote/AdminNoteAdder';
import Button from '../Button';

type ProNotesProps = {
  loan: Object,
};

const isAdmin = Meteor.microservice === 'admin';

const ProNotes = ({
  loan: { _id: loanId, proNotes = [], adminNotes = [] },
}: ProNotesProps) => {
  const [showAll, setShowAll] = useState(false);
  const notes = isAdmin ? adminNotes : proNotes;
  const shownNotes = notes.slice(0, showAll ? undefined : 2);

  return (
    <div className="pro-notes">
      <div className="flex center-align mb-16">
        <h2 className="mr-8">Notes sur le dossier de développement</h2>

        {isAdmin && (
          <AdminNoteAdder
            loanId={loanId}
            buttonProps={{
              raised: true,
              primary: true,
              label: 'Ajouter une note',
            }}
          />
        )}
      </div>
      <div className="flex-col">
        {shownNotes.length ? (
          shownNotes.map(proNote => {
            const { note, id, date, updatedBy, isSharedWithPros } = proNote;
            const { name, src } = employeesById[updatedBy] || {};

            return (
              <div
                key={id}
                className={cx('mb-16 pro-notes-note', {
                  shared: isAdmin && isSharedWithPros,
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
                  {isAdmin && (
                    <AdminNoteAdder
                      loanId={loanId}
                      buttonProps={{
                        label: 'Modifier',
                        size: 'small',
                        className: 'mr-8',
                      }}
                      adminNote={proNote}
                    />
                  )}
                  {isAdmin && isSharedWithPros && (
                    <span className="primary">Partagé avec les pros!</span>
                  )}
                </div>
                {note}
              </div>
            );
          })
        ) : (
          <h3 className="secondary mt-4">Aucune note pour l'instant</h3>
        )}
      </div>
      {notes.length > 2 && (
        <Button primary onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Masquer' : 'Afficher tout'}
        </Button>
      )}
    </div>
  );
};

export default ProNotes;
