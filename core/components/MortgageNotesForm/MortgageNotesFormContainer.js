import { compose, withProps } from 'recompose';

import { mortgageNoteInsert, mortgageNoteRemove } from '../../api';
import {
  MORTGAGE_NOTE_TYPES,
  MORTGAGE_NOTE_CATEGORIES,
  CANTONS,
} from '../../api/constants';

const getInputs = mortgageNote => [
  { id: 'value', type: 'textInput', money: true },
  { id: 'rank', type: 'textInput', number: true, required: false },
  {
    id: 'type',
    type: 'selectFieldInput',
    options: Object.values(MORTGAGE_NOTE_TYPES),
    required: false,
  },
  {
    id: 'category',
    type: 'selectFieldInput',
    options: Object.values(MORTGAGE_NOTE_CATEGORIES),
    required: false,
  },
  {
    id: 'canton',
    type: 'selectFieldInput',
    options: Object.keys(CANTONS),
  },
];

export default compose(withProps(({ borrowerId, propertyId }) => ({
  mortgageNoteInsert: () =>
    mortgageNoteInsert.run({ mortgageNote: {}, borrowerId, propertyId }),
  mortgageNoteRemove: mortgageNoteId =>
    mortgageNoteRemove.run({ mortgageNoteId }),
  getInputs,
})));
