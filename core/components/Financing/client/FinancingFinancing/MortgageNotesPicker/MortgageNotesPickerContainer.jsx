import React from 'react';
import { withProps, compose } from 'recompose';

import T from '../../../../Translation';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import { getProperty } from '../../FinancingCalculator';
import { toMoney } from '../../../../../utils/conversionFunctions';

const sortMortgageNotes = (mortgageNoteIds, borrowers, canton) =>
  borrowers.reduce(
    (obj, { mortgageNotes: notes, name }, index) => {
      const notesWithName = notes.map(note => ({
        ...note,
        borrowerName: name || (
          <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
        ),
        isBorrower: true,
      }));
      return {
        current: [
          ...obj.current,
          ...notesWithName.filter(({ _id }) => mortgageNoteIds.includes(_id)),
        ],
        available: [
          ...obj.available,
          ...notesWithName.filter(({ _id }) => !mortgageNoteIds.includes(_id)),
        ],
      };
    },
    { current: [], available: [] },
  );

const formatBorrowerMortgageNote = (
  notes,
  canton,
  updateStructure,
  mortgageNoteIds,
) =>
  notes
    .filter(({ canton: mortgageNoteCanton }) => mortgageNoteCanton === canton)
    .map(note => ({
      ...note,
      label: (
        <span className="flex-col">
          {`CHF ${toMoney(note.value)}`}
          <span className="secondary">{note.borrowerName}</span>
        </span>
      ),
      onClick: () =>
        updateStructure({
          mortgageNoteIds: [...mortgageNoteIds, note._id],
        }),
    }));

export default compose(
  FinancingDataContainer,
  SingleStructureContainer,
  StructureUpdateContainer,
  withProps((props) => {
    const {
      structure: { mortgageNoteIds = [] },
      borrowers = [],
      updateStructure,
    } = props;
    const { mortgageNotes = [], canton } = getProperty(props);
    const { current, available } = sortMortgageNotes(
      mortgageNoteIds,
      borrowers,
      canton,
    );

    return {
      currentMortgageNotes: mortgageNotes,
      borrowerMortgageNotes: current,
      availableMortgageNotes: formatBorrowerMortgageNote(
        available,
        canton,
        updateStructure,
        mortgageNoteIds,
      ),
      removeMortgageNote: mortgageNoteId =>
        updateStructure({
          mortgageNoteIds: mortgageNoteIds.filter(id => id !== mortgageNoteId),
        }),
    };
  }),
);
