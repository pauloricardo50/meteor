// @flow
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';
import { addStructure } from 'core/api';

export default lifecycle({
  componentDidMount() {
    console.log('component did mount props', this.props);

    if (this.props.loan.structures.length === 0) {
      addStructure.run({ loanId: this.props.loan._id });
    }
  },
});
