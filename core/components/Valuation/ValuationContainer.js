// @flow
import { withProps, withState, compose, lifecycle } from 'recompose';
import { evaluateProperty, propertyDataIsInvalid } from '../../api';

export default compose(
  withState('isLoading', 'setIsLoading', false),
  withProps(({ property: { _id: propertyId }, setIsLoading }) => ({
    handleEvaluateProperty: () => {
      setIsLoading(true);
      evaluateProperty.run({ propertyId }).finally(() => setIsLoading(false));
    },
  })),
  lifecycle({
    constructor() {
      this.state = { disabled: true };
    },
    componentDidMount() {
      propertyDataIsInvalid
        .run({ propertyId: this.props.property._id })
        .then(error => this.setState({ disabled: !!error }));
    },
    componentWillReceiveProps({ property }) {
      if (JSON.stringify(property) !== JSON.stringify(this.props.property)) {
        propertyDataIsInvalid
          .run({ propertyId: property._id })
          .then(error => this.setState({ disabled: !!error }));
      }
    },
  }),
);
