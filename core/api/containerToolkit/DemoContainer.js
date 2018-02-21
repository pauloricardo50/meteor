import {
  createContainer,
  callMutation,
  mutations,
  queries,
  callResolver,
  compose,
  withQuery,
} from '.';

const container1 = component =>
  createContainer(props => ({
    onClick: () =>
      callMutation(mutations.LOAN_DELETE, { loanId: props.loanId }),
    onType: email => callResolver(queries.DOES_USER_EXIST, { email }),
  }))(component);

const container2 = component =>
  compose(
    // How to make this nice ?
    withQuery(() => queries.ALL_LOANS.clone(), { reactive: true }),
    container1,
  )(component);

export { container1, container2 };
