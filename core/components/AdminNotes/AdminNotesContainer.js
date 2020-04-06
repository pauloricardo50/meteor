import { withProps } from 'recompose';

export default withProps(({ doc }) => {
  const {
    _id: docId,
    proNotes = [],
    adminNotes = [],
    proNote,
    user: { referredByUser } = {},
  } = doc;

  return {
    docId,
    proNotes,
    adminNotes,
    proNote,
    referredByUser,
  };
});
