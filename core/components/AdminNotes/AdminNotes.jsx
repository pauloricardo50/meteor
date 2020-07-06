import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import cx from 'classnames';
import moment from 'moment';

import { employeesById } from '../../arrays/epotekEmployees';
import AdminNoteAdder from '../AdminNote/AdminNoteAdder';
import Button from '../Button';
import Icon from '../Icon';
import IconButton from '../IconButton';
import AdminNotesContainer from './AdminNotesContainer';

const isAdmin = Meteor.microservice === 'admin';

export const AdminNotes = ({
  docId,
  proNotes,
  adminNotes,
  proNote,
  referredByUser,
  title = 'Notes',
  NoteAdder = AdminNoteAdder,
  Filters,
  doc,
}) => {
  const [showAll, setShowAll] = useState(false);
  const notes = isAdmin ? adminNotes : proNotes;
  const shownNotes = notes.slice(0, showAll ? undefined : 2);
  const shouldShowProNote =
    isAdmin &&
    proNote &&
    proNote.id &&
    !shownNotes.find(({ id }) => id === proNote.id);

  return (
    <div className="admin-notes">
      <div className="flex center-align mb-16">
        <h2 className="mr-8">{title}</h2>

        {isAdmin && (
          <NoteAdder
            docId={docId}
            buttonProps={{
              raised: true,
              primary: true,
              label: 'Note',
              icon: <Icon type="add" />,
            }}
            referredByUser={referredByUser}
            doc={doc}
            collection={doc._collection}
          />
        )}
        {Filters}
      </div>
      {shouldShowProNote && (
        <div className="card1 card-top pro-note mb-16">
          <div className="primary">Dernière note Pro</div>
          <div className="note">{proNote.note}</div>
        </div>
      )}
      <div className="flex-col">
        {shownNotes.length ? (
          shownNotes.map(shownNote => {
            const { note, id, date, updatedBy, isSharedWithPros } = shownNote;
            const { name, src } = employeesById[updatedBy] || {};

            return (
              <div
                key={id}
                className={cx('mb-16 admin-notes-note', {
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
                    <NoteAdder
                      docId={docId}
                      adminNote={shownNote}
                      collection={doc._collection}
                      doc={doc}
                      triggerComponent={handleOpen => (
                        <IconButton
                          type="edit"
                          size="small"
                          tooltip="Modifier"
                          onClick={handleOpen}
                          className="mr-8"
                        />
                      )}
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

export default AdminNotesContainer(AdminNotes);
