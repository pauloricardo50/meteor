import { withProps } from 'recompose';

export default withProps(({ offerDialog, setOfferDialog }) => ({
  open: !!offerDialog,
  handleClose: () => setOfferDialog(null),
}));
