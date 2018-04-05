import { sidenavActions } from '../reducers/sidenav';

export const showDetailNav = collectionName => ({
  type: sidenavActions.SHOW_DETAIL_NAV,
  collectionName,
});

export const hideDetailNav = () => ({ type: sidenavActions.HIDE_DETAIL_NAV });

export const showMore = () => ({ type: sidenavActions.SHOW_MORE });
