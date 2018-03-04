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
    onClick: () => deleteLoan.run({ loanId: props.loanId }),
    onType: email =>
      doesUserExist.run({ email }).then((emailExists) => {
        console.log('Does user exist: ', emailExists);
      }),
    onSubmit: email =>
    // This is horrible
      doesUserExist
        .clone({ email })
        .fetchSync()
        .then((emailExists) => {
          console.log('Does user exist: ', emailExists);
        }),
  }))(component);

const container2 = component =>
  compose(
    // How to make this nice ?
    withQuery(() => queries.ALL_LOANS.clone(), { reactive: true }),
    container1,
  )(component);

export { container1, container2 };
