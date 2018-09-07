import { withStateHandlers } from 'recompose';

export default withStateHandlers(
  { open: false },
  {
    handleOpen: () => () => ({ open: true }),
    handleClose: () => () => ({ open: false }),
  },
);
