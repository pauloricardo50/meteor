import React from 'react';
import { withProps, compose } from 'recompose';

import T from '../../../../Translation';
import FinancingDataContainer from '../../containers/FinancingDataContainer';
import SingleStructureContainer from '../../containers/SingleStructureContainer';
import StructureUpdateContainer from '../../containers/StructureUpdateContainer';
import { getProperty } from '../../FinancingCalculator';

const formatMortgageNotes = (mortgageNoteIds, borrowers) =>
  borrowers.reduce((arr, { mortgageNotes: notes = [], name }, index) => {
    const notesWithName = notes.map(note => ({
      ...note,
      borrowerName: name || (
        <T id="general.borrowerWithIndex" values={{ index: index + 1 }} />
      ),
      isBorrower: true,
    }));
    return [...arr, ...notesWithName];
  }, []);

const formatBorrowerMortgageNote = (
  notes,
  canton,
  updateStructure,
  mortgageNoteIds,
) =>
  notes.map((note) => {
    const selected = mortgageNoteIds.includes(note._id);
    const available = note.canton === canton;

    return {
      ...note,
      selected,
      available,
      onClick: () => {
        if (available) {
          return updateStructure({
            mortgageNoteIds: [...mortgageNoteIds, note._id],
          });
        }
      },
    };
  });

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
    const notes = formatMortgageNotes(mortgageNoteIds, borrowers);

    return {
      currentMortgageNotes: mortgageNotes,
      borrowerMortgageNotes: formatBorrowerMortgageNote(
        notes,
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
