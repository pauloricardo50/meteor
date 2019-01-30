import { withProps } from 'recompose';

import LenderRulesForm from './LenderRulesForm';

export default withProps({
  onSubmit: (values) => {
    console.log('submit!', values);
  },
})(LenderRulesForm);
