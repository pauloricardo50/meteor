// @flow
import { withProps, withState, compose, lifecycle } from 'recompose';
import { evaluateProperty, propertyDataIsInvalid } from '../../api';

export default compose(
  withState('isLoading', 'setIsLoading', false),
  withProps(({ property: { _id: propertyId }, setIsLoading, loanResidenceType }) => ({
    handleEvaluateProperty: () => {
      setIsLoading(true);
      evaluateProperty
        .run({ propertyId, loanResidenceType })
        .finally(() => setIsLoading(false));
    },
    disabled: true, // Initialize it, and modify it with setState below
  })),
  lifecycle({
    componentDidMount() {
      propertyDataIsInvalid
        .run({
          propertyId: this.props.property._id,
          loanResidenceType: this.props.loanResidenceType,
        })
        .then(error => this.setState({ disabled: !!error, error }));
    },
    componentWillReceiveProps({ property, loanResidenceType }) {
      if (
        JSON.stringify(property) !== JSON.stringify(this.props.property)
        || loanResidenceType !== this.props.loanResidenceType
      ) {
        propertyDataIsInvalid
          .run({ propertyId: property._id, loanResidenceType })
          .then(error => this.setState({ disabled: !!error, error }));
      }
    },
  }),
);
