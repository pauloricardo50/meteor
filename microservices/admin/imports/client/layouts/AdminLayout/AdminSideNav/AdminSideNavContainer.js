import { connect } from 'react-redux';
import { sidenavActions } from '../../../redux/sidenav';

const AdminSideNavContainer = component =>
  connect(
    ({ sidenav: { showDetail, collectionName, showMoreCount } }) => ({
      showDetail,
      collectionName,
      showMoreCount,
    }),
    sidenavActions,
  )(component);

export default AdminSideNavContainer;
