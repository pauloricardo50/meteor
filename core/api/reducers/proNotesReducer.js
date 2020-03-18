const proNotesReducer = {
  body: { adminNotes: 1 },
  reduce: ({ adminNotes = [] }) =>
    adminNotes.filter(({ isSharedWithPros }) => isSharedWithPros),
};

export default proNotesReducer;
