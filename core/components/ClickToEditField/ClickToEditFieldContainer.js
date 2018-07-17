import { withState, compose } from 'recompose';

export default compose(withState('isEditing', 'toggleEdit', false));
