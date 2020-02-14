import React from 'react';
import cx from 'classnames';
import moment from 'moment';

import { employeesById } from '../../../core/arrays/epotekEmployees';
import FrontCardItem from '../../FrontCard/FrontCardItem';

const LoanNotes = ({ notes = [] }) => {
  const shownNotes = notes.slice(0, 2);

  return (
    <FrontCardItem
      label="Notes"
      data={
        <div className="loan-notes" style={{ marginTop: 4 }}>
          <div className="flex-col">
            {shownNotes.length ? (
              shownNotes.map(shownNote => {
                const {
                  note,
                  id,
                  date,
                  updatedBy,
                  isSharedWithPros,
                } = shownNote;
                const { name, src } = employeesById[updatedBy] || {};

                return (
                  <div
                    key={id}
                    className={cx('mb-16 loan-notes-note', {
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

                      {isSharedWithPros && (
                        <span className="primary">Partagé avec les pros!</span>
                      )}
                    </div>
                    {note}
                  </div>
                );
              })
            ) : (
              <p className="secondary mt-4">Aucune note pour l'instant</p>
            )}
          </div>
        </div>
      }
    />
  );
};

export default LoanNotes;
