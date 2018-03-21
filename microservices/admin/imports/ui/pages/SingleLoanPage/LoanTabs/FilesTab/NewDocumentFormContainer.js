import { createContainer, addDocument } from 'core/api';
import { withState, compose } from 'recompose';

export default compose(
  withState('value', 'onChange', ''),
  createContainer(({ loanId, value, onChange }) => ({
    onChange: newValue => onChange(newValue),
    addDocument: () => {
      onChange('');
      addDocument.run({ documentName: value, loanId });
    },
  })),
);
