import { compose, withProps } from 'recompose';

import { mortgageNoteInsert, mortgageNoteRemove } from '../../api';
import {
  MORTGAGE_NOTE_CATEGORIES,
  MORTGAGE_NOTE_TYPES,
} from '../../api/helpers/sharedSchemaConstants';
import { CANTONS } from '../../api/loans/loanConstants';
import withTranslationContext from '../Translation/withTranslationContext';

const makeGetInputs = withCanton => mortgageNote =>
  [
    { id: 'value', type: 'textInput', money: true },
    withCanton
      ? {
          id: 'canton',
          type: 'selectFieldInput',
          options: Object.keys(CANTONS),
        }
      : null,
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
  ].filter(x => x);

export default compose(
  // To trigger the proper Forms.value
  withTranslationContext(() => ({ purchaseType: 'mortgageNote' })),
  withProps(({ borrowerId, propertyId }) => ({
    mortgageNoteInsert: () =>
      mortgageNoteInsert.run({ mortgageNote: {}, borrowerId, propertyId }),
    mortgageNoteRemove: mortgageNoteId =>
      mortgageNoteRemove.run({ mortgageNoteId }),
    getInputs: makeGetInputs(!!borrowerId),
  })),
);
